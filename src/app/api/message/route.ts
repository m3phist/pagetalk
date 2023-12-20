// import { db } from '@/db';
// import { openai } from '@/lib/openai';
// import { pinecone } from '@/lib/pinecone';
// import { SendMessageValidator } from '@/lib/validators/SendMessageValidator';
// import { auth } from '@clerk/nextjs';
// import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
// import { PineconeStore } from 'langchain/vectorstores/pinecone';
// import { NextRequest } from 'next/server';

// import { OpenAIStream, StreamingTextResponse } from 'ai';

// export const POST = async (req: NextRequest) => {
//   // endpoint for asking a question to a pdf file

//   const body = await req.json();

//   const { userId } = auth();

//   if (!userId) {
//     return new Response('Unauthorized', { status: 401 });
//   }

//   const { fileId, message } = SendMessageValidator.parse(body);

//   const file = await db.file.findFirst({
//     where: {
//       id: fileId,
//       userId,
//     },
//   });

//   if (!file) {
//     return new Response('Not found', { status: 404 });
//   }

//   await db.message.create({
//     data: {
//       text: message,
//       isUserMessage: true,
//       userId,
//       fileId,
//     },
//   });

//   // 1. Vectorize message
//   const embeddings = new OpenAIEmbeddings({
//     openAIApiKey: process.env.OPEN_API_KEY!,
//   });

//   const pineconeIndex = pinecone.index('pagetalk');

//   const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
//     pineconeIndex,
//     namespace: file.id,
//   });

//   const results = await vectorStore.similaritySearch(message, 4);

//   // retrieving previous message
//   const prevMessages = await db.message.findMany({
//     where: {
//       fileId,
//     },
//     orderBy: {
//       createdAt: 'asc',
//     },
//     take: 6,
//   });

//   const formattedPrevMessages = prevMessages.map((msg) => ({
//     role: msg.isUserMessage ? ('user' as const) : ('assistant' as const),
//     content: msg.text,
//   }));

//   const response = await openai.chat.completions.create({
//     model: 'gpt-4',
//     temperature: 0,
//     stream: true,
//     messages: [
//       {
//         role: 'system',
//         content:
//           'Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format.',
//       },
//       {
//         role: 'user',
//         content: `Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format. \nIf you don't know the answer, just say that you don't know, don't try to make up an answer.

//   \n----------------\n

//   PREVIOUS CONVERSATION:
//   ${formattedPrevMessages.map((message) => {
//     if (message.role === 'user') return `User: ${message.content}\n`;
//     return `Assistant: ${message.content}\n`;
//   })}

//   \n----------------\n

//   CONTEXT:
//   ${results.map((r) => r.pageContent).join('\n\n')}

//   USER INPUT: ${message}`,
//       },
//     ],
//   });

//   const stream = OpenAIStream(response, {
//     async onCompletion(completion) {
//       await db.message.create({
//         data: {
//           text: completion,
//           isUserMessage: false,
//           fileId,
//           userId,
//         },
//       });
//     },
//   });

//   return new StreamingTextResponse(stream);
// };

import { db } from '@/db';
import { openai } from '@/lib/openai';
import { pinecone } from '@/lib/pinecone';
import { SendMessageValidator } from '@/lib/validators/SendMessageValidator';
import { auth } from '@clerk/nextjs';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { NextRequest, NextResponse } from 'next/server';

import { OpenAIStream, StreamingTextResponse } from 'ai';

export const POST = async (req: NextRequest) => {
  try {
    // endpoint for asking a question to a pdf file
    const body = await req.json();
    const { userId } = auth();

    if (!userId) {
      return new Response('Unauthorized', { status: 401 });
    }

    const { fileId, message } = SendMessageValidator.parse(body);

    const file = await db.file.findFirst({
      where: {
        id: fileId,
        userId,
      },
    });

    if (!file) {
      return new Response('Not found', { status: 404 });
    }

    await db.message.create({
      data: {
        text: message,
        isUserMessage: true,
        userId,
        fileId,
      },
    });

    // 1. Vectorize message
    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPEN_API_KEY!,
    });

    const pineconeIndex = pinecone.index('pagetalk');

    const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex,
      namespace: file.id,
    });

    const results = await vectorStore.similaritySearch(message, 4);

    // retrieving previous message
    const prevMessages = await db.message.findMany({
      where: {
        fileId,
      },
      orderBy: {
        createdAt: 'asc',
      },
      take: 6,
    });

    const formattedPrevMessages = prevMessages.map((msg) => ({
      role: msg.isUserMessage ? ('user' as const) : ('assistant' as const),
      content: msg.text,
    }));

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      temperature: 0,
      stream: true,
      messages: [
        {
          role: 'system',
          content:
            'Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format.',
        },
        {
          role: 'user',
          content: `Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format. \nIf you don't know the answer, just say that you don't know, don't try to make up an answer.
        
  \n----------------\n
  
  PREVIOUS CONVERSATION:
  ${formattedPrevMessages.map((message) => {
    if (message.role === 'user') return `User: ${message.content}\n`;
    return `Assistant: ${message.content}\n`;
  })}
  
  \n----------------\n
  
  CONTEXT:
  ${results.map((r) => r.pageContent).join('\n\n')}
  
  USER INPUT: ${message}`,
        },
      ],
    });

    const stream = OpenAIStream(response, {
      async onCompletion(completion) {
        await db.message.create({
          data: {
            text: completion,
            isUserMessage: false,
            fileId,
            userId,
          },
        });
      },
    });

    return new StreamingTextResponse(stream);
  } catch (error: any) {
    console.log('[MESSAGE]', error);
    return new NextResponse(`Stream Error: ${error.message}`, { status: 400 });
  }
};
