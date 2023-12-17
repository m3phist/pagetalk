import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { auth } from '@clerk/nextjs';

export async function POST(req: Request) {
  try {
    const s3 = new S3Client({
      region: process.env.NEXT_PUBLIC_AWS_S3_REGION!,
      credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!,
      },
    });

    const { userId } = auth();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file');

    // file check
    if (!file) {
      return new NextResponse('File is required', { status: 400 });
    }
  } catch (error) {
    console.log('[S#_UPLOAD]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
