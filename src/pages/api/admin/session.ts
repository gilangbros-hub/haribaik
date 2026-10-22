export const GET = ({ locals }: { locals: App.Locals }) => {
  if (!locals.adminUser) return Response.json({ error: 'Admin access required.' }, { status: 401 });
  return Response.json({ email: locals.adminUser.email });
};
