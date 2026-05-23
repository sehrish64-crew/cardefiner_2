import { NextResponse } from 'next/server';
import { insertReview, getAllReviews } from '@/lib/database';

export async function GET() {
  try {
    const reviews = await getAllReviews();
    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch reviews';
    // In development, avoid returning 500 to prevent UI breakage; return empty list so Testimonials can render.
    if (process.env.NODE_ENV === 'development') {
      console.warn('[API][reviews] Returning empty list in development due to error:', errorMessage);
      return NextResponse.json([]);
    }

    return NextResponse.json(
      { error: errorMessage, success: false },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    console.log('📝 [REVIEW API] POST request received');
    const body = await request.json();
    const { name, email, rating, comment } = body;

    console.log('📝 [REVIEW API] Received review submission:', { name, email, rating, commentLength: comment?.length });

    // Validate required fields
    if (!name || !email || !rating || !comment) {
      console.warn('⚠️ [REVIEW API] Missing required fields:', { 
        hasName: !!name, 
        hasEmail: !!email, 
        hasRating: !!rating, 
        hasComment: !!comment 
      });
      return NextResponse.json(
        { error: 'Missing required fields: name, email, rating, and comment are required' },
        { status: 400 }
      );
    }

    // Validate rating range
    if (rating < 1 || rating > 5) {
      console.warn('⚠️ [REVIEW API] Invalid rating:', rating);
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.warn('⚠️ [REVIEW API] Invalid email format:', email);
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    console.log('✅ [REVIEW API] Validation passed, inserting review into database...');
    const review = await insertReview({ name, email, rating, comment });
    console.log('✅ [REVIEW API] Review created successfully:', { id: review.id, status: review.status });

    // Notify admin about new review (non-blocking)
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
      console.log('📧 [REVIEW API] Sending review notification email using baseUrl:', baseUrl);
      const resp = await fetch(`${baseUrl}/api/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'review_notification',
          reviewId: review.id,
          name: review.name,
          email: review.email,
          rating: review.rating,
          comment: review.comment,
          createdAt: review.created_at,
        }),
      })

      try {
        const json = await resp.json()
        if (!resp.ok || json?.success === false) {
          console.error('⚠️ [REVIEW API] Review notification email failed:', resp.status, json)
        } else {
          console.log('✅ [REVIEW API] Review notification email sent successfully')
        }
      } catch (e) {
        const text = await resp.text().catch(() => null)
        console.error('⚠️ [REVIEW API] Failed to parse send-email response:', resp.status, text)
      }
    } catch (err) {
      console.error('⚠️ [REVIEW API] Failed to send review notification (non-blocking):', err)
    }

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error('❌ [REVIEW API] Error creating review:', error);
    
    // Log the full error
    if (error instanceof Error) {
      console.error('❌ [REVIEW API] Error name:', error.name);
      console.error('❌ [REVIEW API] Error message:', error.message);
      console.error('❌ [REVIEW API] Error stack:', error.stack);
    } else {
      console.error('❌ [REVIEW API] Full error object:', JSON.stringify(error, null, 2));
    }
    
    // Provide more specific error messages
    let errorMessage = 'Failed to create review';
    let statusCode = 500;
    let errorCode = 'UNKNOWN_ERROR';
    
    if (error instanceof Error) {
      const errorStr = error.message.toLowerCase();
      
      // Check for database connection errors
      if (errorStr.includes('econnrefused') || errorStr.includes('connect') || errorStr.includes('timeout') || errorStr.includes('enotfound')) {
        errorMessage = 'Database connection failed. Initializing database...';
        statusCode = 503;
        errorCode = 'DB_CONNECTION_FAILED';
        console.error('❌ [REVIEW API] Database connection issue detected');
      } 
      // Check for table not found
      else if (errorStr.includes('no such table') || errorStr.includes('er_no_such_table') || errorStr.includes("doesn't exist") || errorStr.includes('syntax error') || errorStr.includes('ER_NO_REFERENCED_TABLE')) {
        errorMessage = 'Review system initialization required. Please try again.';
        statusCode = 503;
        errorCode = 'TABLE_NOT_FOUND';
        console.error('❌ [REVIEW API] Table not found - database schema may not be initialized');
      }
      // Check for other database errors
      else if (errorStr.includes('er_')) {
        errorMessage = 'Database error. Please try again or contact support.';
        statusCode = 500;
        errorCode = 'DATABASE_ERROR';
        console.error('❌ [REVIEW API] Database error code detected');
      }
      // Check for permission errors
      else if (errorStr.includes('permission') || errorStr.includes('access denied') || errorStr.includes('er_access_denied')) {
        errorMessage = 'Database access denied. Please check credentials.';
        statusCode = 500;
        errorCode = 'ACCESS_DENIED';
        console.error('❌ [REVIEW API] Database access denied');
      }
      // Check for JSON parse errors
      else if (errorStr.includes('json')) {
        errorMessage = 'Invalid request format. Please try again.';
        statusCode = 400;
        errorCode = 'INVALID_JSON';
        console.error('❌ [REVIEW API] JSON parse error');
      }
      // Use the actual error message if available
      else {
        errorMessage = error.message || errorMessage;
        errorCode = 'API_ERROR';
      }
    }
    
    const errorResponse = { 
      error: errorMessage,
      errorCode,
      timestamp: new Date().toISOString(),
      ...(process.env.NODE_ENV === 'development' && { 
        details: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      })
    };
    
    console.error('❌ [REVIEW API] Returning error response:', errorResponse);
    
    return NextResponse.json(
      errorResponse,
      { status: statusCode }
    );
  }
}
