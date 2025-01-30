import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import FormData from '../../../model/applicationFormData';

// ✅ Handle POST request (Create a new form entry)
export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    const data = await req.json();
    const newForm = await FormData.create(data);
    return NextResponse.json({ success: true, data: newForm }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

// ✅ Handle GET request (Retrieve all form entries)
export async function GET() {
  await dbConnect();
  try {
    const forms = await FormData.find();
    return NextResponse.json({ success: true, data: forms }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
