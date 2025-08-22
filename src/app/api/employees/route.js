import { NextResponse } from 'next/server';
import employeesData from '../../../data/employees.json';

export async function GET() {
  try {
    return NextResponse.json(employeesData);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch employees' },
      { status: 500 }
    );
  }
}
