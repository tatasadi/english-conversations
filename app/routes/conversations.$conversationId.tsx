import { SentenceType } from "@prisma/client";
import { ActionArgs, LoaderArgs, json, redirect } from "@remix-run/node";
import {
  Form,
  isRouteErrorResponse,
  useActionData,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import { useEffect, useRef } from "react";
import invariant from "tiny-invariant";
import {
  createSentence,
  deleteConversation,
  getConversation,
} from "~/models/conversation.server";
import { requireUserId } from "~/session.server";

export async function loader({ request, params }: LoaderArgs) {
  invariant(params.conversationId, "conversationId not found");

  const conversation = await getConversation({ id: params.conversationId });
  //console.log(conversation);
  if (!conversation) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ conversation });
}

export async function action({ request, params }: ActionArgs) {
  const userId = await requireUserId(request);
  const conversationId = params.conversationId;
  invariant(conversationId, "conversationId not found");

  const formData = await request.formData();
  const requestType = formData.get("request-type");

  switch (requestType) {
    case "delete-conversation":
      await deleteConversation({ userId, id: conversationId });
      return redirect("/conversations");

    case "add-sentence":
      const typeString = formData.get("type");
      const text = formData.get("sentence");

      if (typeof typeString !== "string" || typeString.length === 0) {
        return json(
          { errors: { type: "Type is required", text: null } },
          { status: 400 }
        );
      }

      if (typeof text !== "string" || text.length === 0) {
        return json(
          { errors: { type: null, text: "text is required" } },
          { status: 400 }
        );
      }

      let type;
      switch (typeString) {
        case "PersonA":
          type = SentenceType.PersonA;
          break;
        case "PersonB":
          type = SentenceType.PersonB;
          break;
        default:
          type = SentenceType.Description;
          break;
      }

      let response = await createSentence({ type, text, conversationId });

      return json(response);
  }
}

export default function ConversationDetailsPage() {
  const { conversation } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const addFormRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    addFormRef.current?.reset();
  }, [actionData]);

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
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white">
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
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white">
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

      <Form method="post" ref={addFormRef}>
        <input value="add-sentence" name="request-type" readOnly hidden />

        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-between">
          <div className="">
            <div className="">
              <select
                name="type"
                id="type"
                autoComplete="type"
                className="block w-full rounded-md border-0 bg-white p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-7"
              >
                <option value="Description">Description</option>
                <option value="PersonA">Person A</option>
                <option value="PersonB">Person B</option>
              </select>
            </div>
          </div>

          <div className="grow">
            <div className="">
              <input
                type="text"
                name="sentence"
                id="sentence"
                min={1}
                autoComplete="sentence"
                className="focus:ring-0.5 ring-1shadow-sm block w-full rounded-md border-0 p-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <button
            type="submit"
            className="self-center rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-600 focus:bg-indigo-400 sm:col-span-2"
          >
            Add Sentence
          </button>
        </div>
      </Form>
      <hr className="my-4" />
      <Form method="post" className="flex flex-col">
        <input
          value="delete-conversation"
          name="request-type"
          readOnly
          hidden
        />
        <button
          type="submit"
          className="self-center rounded  bg-red-600 px-4 py-2 text-white hover:bg-indigo-600 focus:bg-indigo-400"
        >
          Delete Conversation
        </button>
      </Form>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (error instanceof Error) {
    return <div>An unexpected error occurred: {error.message}</div>;
  }

  if (!isRouteErrorResponse(error)) {
    return <h1>Unknown Error</h1>;
  }

  if (error.status === 404) {
    return <div>Conversation not found</div>;
  }

  return <div>An unexpected error occurred: {error.statusText}</div>;
}
