import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/accounts/index/$accountId")({
  loader: async ({ params }) => {
    return {
      account: {
        id: params.accountId,
      },
    };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const account = Route.useLoaderData();

  return <div>Hello {account.account.id}!</div>;
}
