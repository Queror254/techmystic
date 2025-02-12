import { NextResponse } from "next/server";
import http from "http"; // Use HTTP instead of HTTPS
import { IncomingMessage } from "http";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const baseUrl = "http://51.20.9.253"; // Use HTTP instead of HTTPS
    const path = request.nextUrl.pathname.replace("/api/proxy", "#home");
    const search = request.nextUrl.search || "";
    const targetUrl = `${baseUrl}${path}${search}`;

    try {
        const response = await new Promise<IncomingMessage>((resolve, reject) => {
            http.get(targetUrl, resolve).on("error", reject);
        });

        let data = "";
        response.on("data", (chunk) => (data += chunk));

        const result = await new Promise<string>((resolve) => {
            response.on("end", () => resolve(data));
        });

        // Get Content-Type from response headers
        const contentType = response.headers["content-type"] || "text/plain";

        // Fix asset paths if HTML content is returned
        if (contentType.includes("text/html")) {
            const fixedHtml = result
                .replace(/href="\//g, `href="${baseUrl}/`)
                .replace(/src="\//g, `src="${baseUrl}/`);

            return new NextResponse(fixedHtml, {
                headers: { "Content-Type": contentType },
            });
        }

        return new NextResponse(result, {
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
