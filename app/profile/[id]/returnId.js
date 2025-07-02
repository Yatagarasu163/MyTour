export default async function returnId({ params }) {
    const { id } = await params;
    return id;
}