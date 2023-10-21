export default async function revalidatePin() {
  await fetch(
    `${process.env.NEXT_PUBLIC_URL_SITE}/api/revalidation?tag=pin&secret=${process.env.NEXT_PUBLIC_REVALIDATION_SECRET}`,
    { method: 'GET' }
  );
}
