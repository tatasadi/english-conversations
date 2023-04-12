import { ActionArgs, LoaderArgs, json, redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import {
  deleteConversation,
  getConversation,
} from "~/models/conversation.server";
import { requireUserId } from "~/session.server";

export async function loader({ request, params }: LoaderArgs) {
  invariant(params.conversationId, "conversationId not found");

  const conversation = await getConversation({ id: params.conversationId });
  console.log(conversation);
  if (!conversation) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ conversation });
}

export async function action({ request, params }: ActionArgs) {
  const userId = await requireUserId(request);
  invariant(params.conversationId, "conversationId not found");

  await deleteConversation({ userId, id: params.conversationId });

  return redirect("/conversation");
}

export default function ConversationDetailsPage() {
  const { conversation } = useLoaderData<typeof loader>();

  return (
    <div
      style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}
      className="mx-auto max-w-4xl p-4"
    >
      <h1 className="text-center text-xl">
        Level {conversation.level}, Course {conversation.course}, Lesson{" "}
        {conversation.lesson}
      </h1>
      <main className="mt-4 grid grid-cols-12 gap-y-2 rounded-lg border bg-gray-100 p-4">
        {conversation.sentences.map((c) => {
          switch (c.type) {
            case "PersonA":
              return (
                <div
                  key={c.id}
                  className="col-start-1 col-end-13 rounded-lg p-3 sm:col-end-8"
                >
                  <div className="flex flex-row items-center">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-indigo-500">
                      A
                    </div>
                    <div className="relative ml-3 rounded-xl bg-white px-4 py-2 text-sm shadow">
                      <div>{c.text}</div>
                    </div>
                  </div>
                </div>
              );
            case "PersonB":
              return (
                <div
                  key={c.id}
                  className="col-start-1 col-end-13 rounded-lg p-3 sm:col-start-6"
                >
                  <div className="flex flex-row-reverse items-center">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-indigo-500">
                      B
                    </div>
                    <div className="relative mr-3 rounded-xl bg-indigo-100 px-4 py-2 text-sm shadow">
                      <div>{c.text}</div>
                    </div>
                  </div>
                </div>
              );
            default:
              return (
                <div
                  key={c.id}
                  className="col-span-12 flex justify-center text-sm"
                >
                  <div className="rounded-lg bg-gray-300 px-6 py-2">
                    {c.text}
                  </div>
                </div>
              );
          }
        })}
      </main>
      <hr className="my-4" />
      <Form method="post">
        <button
          type="submit"
          className="rounded bg-indigo-500  px-4 py-2 text-white hover:bg-indigo-600 focus:bg-indigo-400"
        >
          Delete Conversation
        </button>
      </Form>
    </div>
  );
}
