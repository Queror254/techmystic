import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export const runtime = 'edge';

export async function GET(request: NextRequest) {
    const baseUrl = "http://51.20.9.253";
    const path = request.nextUrl.pathname.replace("/api/proxy", "#home");
    const search = request.nextUrl.search || "";
    const targetUrl = `${baseUrl}${path}${search}`;

    try {
        const response = await fetch(targetUrl);
        const contentType = response.headers.get("content-type") || "text/plain";

        if (contentType.includes("text/html") || contentType.includes("text/css")) {
            const result = await response.text();
            const fixedContent = result
                .replace(/href="\//g, `href="${baseUrl}/`)
                .replace(/src="\//g, `src="${baseUrl}/`)
                .replace(/url\(['"]?\//g, `url(${baseUrl}/`)
                .replace(/url\((?!['"]?(?:data:|http:|https:))/g, `url(${baseUrl}/`);

            return new NextResponse(fixedContent, {
                headers: {
                    "Content-Type": contentType,
                    "Access-Control-Allow-Origin": "*",
                },
            });
        }

        // For non-HTML/CSS responses, stream the response directly
        return new NextResponse(response.body, {
            headers: {
                "Content-Type": contentType,
                "Access-Control-Allow-Origin": "*",
            },
        });

    } catch (error) {
        console.error("Proxy error:", error);
        return NextResponse.json(
            { error: "Error fetching the resource" },
            { status: 500 }
        );
    }
}
