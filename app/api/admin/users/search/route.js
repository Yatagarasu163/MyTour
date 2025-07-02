import { db } from "@/lib/actions/pool";

export async function POST(request, context){
    const params = await Promise.resolve(context.params);
    console.log(params);
    return new Response(JSON.stringify({}), {status: 200});
}