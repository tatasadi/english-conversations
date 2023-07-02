import { Level } from "@prisma/client";
import { ActionArgs, json, redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";
import invariant from "tiny-invariant";
import { createConversation } from "~/models/conversation.server";
import { requireUserId } from "~/session.server";

export async function action({ request, params }: ActionArgs) {
  const userId = await requireUserId(request);

  const formData = await request.formData();

  const levelString = formData.get("level");
  const course = Number(formData.get("course"));
  let courseName = formData.get("courseName")?.toString();
  const lesson = Number(formData.get("lesson"));

  if (typeof levelString !== "string" || levelString.length === 0) {
    return json(
      { errors: { level: "level is required", course: null, lesson: null } },
      { status: 400 }
    );
  }

  if (
    course <= 0 &&
    (typeof courseName !== "string" || courseName.length === 0)
  ) {
    return json(
      {
        errors: {
          level: null,
          course: "course or course name is required",
          lesson: null,
        },
      },
      { status: 400 }
    );
  }

  if (lesson <= 0) {
    return json(
      { errors: { level: null, course: null, lesson: "lesson is required" } },
      { status: 400 }
    );
  }

  let level;
  switch (levelString) {
    case "A1":
      level = Level.A1;
      break;
    case "A2":
      level = Level.A2;
      break;
    case "B1":
      level = Level.B1;
      break;
    case "B2":
      level = Level.B2;
      break;
    case "C1":
      level = Level.C1;
      break;
    case "C2":
      level = Level.C2;
      break;
    case "BusinessA2":
      level = Level.BusinessA2;
      break;
    case "BusinessB1":
      level = Level.BusinessB1;
      break;
    case "BusinessB2":
      level = Level.BusinessB2;
      break;
    case "BusinessC1":
      level = Level.BusinessC1;
      break;
    default:
      level = Level.Business;
      break;
  }

  if (!courseName) courseName = "";

  let conversation = await createConversation({
    level,
    course,
    courseName,
    lesson,
    userId,
  });

  return redirect(`/conversations/${conversation.id}`);
}

export default function NewConversationPage() {
  return (
    <Form method="post" className="flex w-full flex-col gap-8">
      <div className="px-2 py-4">
        <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-8">
          <div className="sm:col-span-2">
            <label
              htmlFor="level"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Level
            </label>
            <div className="mt-2">
              <select
                name="level"
                id="level"
                autoComplete="level"
                className="block w-full rounded-md border-0 bg-white p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-5"
              >
                <option>A1</option>
                <option>A2</option>
                <option>B1</option>
                <option>B2</option>
                <option>C1</option>
                <option>C2</option>
                <option>BusinessA2</option>
                <option>BusinessB1</option>
                <option>BusinessB2</option>
                <option>BusinessC1</option>
              </select>
            </div>
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="course"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Course
            </label>
            <div className="mt-2">
              <input
                type="number"
                name="course"
                id="course"
                min={1}
                autoComplete="course"
                className="focus:ring-0.5 block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="courseName"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Course Name
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="courseName"
                id="courseName"
                autoComplete="courseName"
                className="focus:ring-0.5 block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="lesson"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Lesson
            </label>
            <div className="mt-2">
              <input
                type="number"
                name="lesson"
                id="lesson"
                min={1}
                autoComplete="lesson"
                className="focus:ring-0.5 block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
        </div>
      </div>
      <button
        type="submit"
        className="self-center rounded bg-primary-600 px-4 py-2 text-white hover:bg-primary-600 focus:bg-primary-400 sm:col-span-2"
      >
        Add New Conversation
      </button>
    </Form>
  );
}
