import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const baseUrl = "http://51.20.9.253";
    const path = request.nextUrl.pathname.replace("/api/proxy", "#home");
    const search = request.nextUrl.search || "";
    const targetUrl = `${baseUrl}${path}${search}`;

    try {
        const response = await fetch(targetUrl);
        const contentType = response.headers.get("content-type") || "text/plain";

        if (contentType.includes("text/html")) {
            const result = await response.text();
            const fixedHtml = result
                .replace(/href="\//g, `href="${baseUrl}/`)
                .replace(/src="\//g, `src="${baseUrl}/`);

            return new NextResponse(fixedHtml, {
                headers: { "Content-Type": contentType },
            });
        }

        // For non-HTML responses, stream the response directly
        return new NextResponse(response.body, {
            headers: { "Content-Type": contentType },
        });

    } catch (error) {
        console.error("Proxy error:", error);
        return NextResponse.json(
            { error: "Error fetching the resource" },
            { status: 500 }
        );
    }
}
