import { json, LoaderArgs } from "@remix-run/node";
import {
  Form,
  Link,
  NavLink,
  Outlet,
  useLoaderData,
  V2_MetaFunction,
} from "@remix-run/react";
import { getConversationListItems } from "~/models/conversation.server";
import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";

export const meta: V2_MetaFunction = () => {
  return [{ title: "Save Conversations" }];
};

export const loader = async ({ request }: LoaderArgs) => {
  const userId = await requireUserId(request);
  const conversationListItems = await getConversationListItems({ userId });
  return json({ conversationListItems });
};

export default function ConversationsPage() {
  const data = useLoaderData<typeof loader>();
  const user = useUser();
  return (
    <div className="flex h-full min-h-screen flex-col">
      <header className="flex items-center justify-between bg-slate-800 p-4 text-white">
        <h1 className="text-3xl font-bold">
          <Link to=".">Conversations</Link>
        </h1>
        <p>{user.email}</p>
        <Form action="/logout" method="post">
          <button
            type="submit"
            className="rounded bg-slate-600 px-4 py-2 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
          >
            Logout
          </button>
        </Form>
      </header>

      <main className="flex h-full bg-white">
        <div className="h-full w-80 border-r bg-gray-50">
          <Link to="new" className="block p-4 text-xl text-blue-500">
            + New Conversation
          </Link>

          <hr />
          {data.conversationListItems.length === 0 ? (
            <p className="p-4">No conversations yet</p>
          ) : (
            <ol>
              {data.conversationListItems.map((conversation) => (
                <li key={conversation.id}>
                  <NavLink
                    className={({ isActive }) =>
                      `block border-b p-4 text-xl ${isActive ? "bg-white" : ""}`
                    }
                    to={conversation.id}
                  >
                    {conversation.level}- {conversation.course}-{" "}
                    {conversation.lesson}
                  </NavLink>
                </li>
              ))}
            </ol>
          )}
        </div>

        <div className="flex-1 p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
