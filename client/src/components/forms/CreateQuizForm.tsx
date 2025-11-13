import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createQuizSchema,
  type CreateQuizFormData,
} from "../../lib/validation";

interface CreateQuizFormProps {
  onSubmit: (data: CreateQuizFormData) => Promise<void>;
  isLoading?: boolean;
}

export function CreateQuizForm({
  onSubmit,
  isLoading = false,
}: CreateQuizFormProps) {
  const [error, setError] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateQuizFormData>({
    resolver: zodResolver(createQuizSchema),
  });

  const onSubmitHandler = async (data: CreateQuizFormData) => {
    try {
      setError("");
      await onSubmit(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create quiz";
      setError(message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          Quiz Title
        </label>
        <input
          id="title"
          type="text"
          {...register("title")}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter quiz title"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <textarea
          id="description"
          {...register("description")}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Describe your quiz"
          rows={4}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">
            {errors.description.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="timeLimitSeconds"
          className="block text-sm font-medium text-gray-700"
        >
          Time Limit (seconds) - Optional
        </label>
        <input
          id="timeLimitSeconds"
          type="number"
          {...register("timeLimitSeconds")}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Leave empty for no limit"
        />
        {errors.timeLimitSeconds && (
          <p className="mt-1 text-sm text-red-600">
            {errors.timeLimitSeconds.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition"
      >
        {isLoading ? "Creating..." : "Create Quiz"}
      </button>
    </form>
  );
}
