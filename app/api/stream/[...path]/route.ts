import { NextRequest, NextResponse } from 'next/server'

const ROBOT_STREAM_BASE = 'http://100.112.177.9:8000'

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const path = params.path?.join('/') || ''
    const streamUrl = `${ROBOT_STREAM_BASE}/${path}`
    
    console.log('Proxying stream request:', streamUrl)
    
    const response = await fetch(streamUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Aura-67-Dashboard/1.0',
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch stream: ${response.status} ${response.statusText}`)
    }

    const contentType = response.headers.get('content-type') || 'application/vnd.apple.mpegurl'
    
    // For HLS streams, we need to handle both manifest and segment files
    let data: ArrayBuffer | string
    
    if (contentType.includes('mpegurl') || contentType.includes('m3u8')) {
      // Handle manifest files - need to modify URLs to point to our proxy
      const textData = await response.text()
      
      // Replace any relative URLs in the manifest to use our proxy
      const modifiedData = textData.replace(
        /^(?!https?:\/\/|\/api\/stream\/)([^\s]+\.ts|[^\s]+\.m4s|[^\s]+\.mp4)/gm,
        `/api/stream/$1`
      )
      
      data = modifiedData
    } else {
      // Handle video segments as binary data
      data = await response.arrayBuffer()
    }

    return new NextResponse(data, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Cache-Control': contentType.includes('mpegurl') ? 'no-cache' : 'public, max-age=3600',
        'Cross-Origin-Resource-Policy': 'cross-origin',
      },
    })
  } catch (error) {
    console.error('Stream proxy error:', error)
    return NextResponse.json(
      { error: 'Failed to proxy stream', details: error instanceof Error ? error.message : 'Unknown error' },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      }
    )
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    },
  })
}