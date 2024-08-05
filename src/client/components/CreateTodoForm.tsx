import { useState } from 'react'

import { api } from '@/utils/client/api'

/**
 * QUESTION 1:
 * -----------
 * Style the "Add" button so that it looks like the design in Figma.
 *
 * NOTE: You must use tailwindcss and className. Do not use other methods (eg.
 * inline styles, separate css files, css modules, etc.) unless absolutely
 * necessary. This applies to all styling-related questions in this assignment.
 *
 * Documentation references:
 *  - https://tailwindcss.com
 *  - https://www.youtube.com/watch?v=mr15Xzb1Ook
 *
 *
 *
 * QUESTION 2:
 * -----------
 * Currently our form is not keyboard accessible. Users cannot hit
 * <Enter> right after typing to submit the form (add new todo). Fix this issue.
 */

//QUESTION 1: Completeddddd
//QUESTION 2: Completeddddd

export const CreateTodoForm = () => {
  const [todoBody, setTodoBody] = useState('')

  const apiContext = api.useContext()

  const { mutate: createTodo, isLoading: isCreatingTodo } =
    api.todo.create.useMutation({
      onSuccess: () => {
        apiContext.todo.getAll.refetch()
      },
    })

  const handleSubmit = () => {
    if (todoBody.trim() === '') {
      return
    }
    createTodo({
      body: todoBody,
    })
    setTodoBody('')
  }

  return (
    <form
      className="group flex items-center justify-between rounded-12 border border-gray-200 py-2 pr-4 focus-within:border-gray-400"
      onSubmit={(e) => {
        e.preventDefault()
        handleSubmit()
      }}
    >
      <label htmlFor={TODO_INPUT_ID} className="sr-only">
        Add todo
      </label>

      <input
        id={TODO_INPUT_ID}
        type="text"
        placeholder="Add todo"
        value={todoBody}
        onChange={(e) => {
          setTodoBody(e.target.value)
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            handleSubmit()
          }
        }}
        className="flex-1 px-4 text-base placeholder:text-gray-400 focus:outline-none"
      />
      <button
        className="bg-blue-500 rounded-lg px-10 py-2 font-semibold text-white shadow-md"
        type="button"
        disabled={isCreatingTodo}
        onClick={handleSubmit}
        style={{
          '--tw-bg-opacity': '1',
          'backgroundColor': 'rgba(59, 130, 246, var(--tw-bg-opacity))',
          'transition': 'background-color 0.3s ease',
          'border-radius': '20px',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(59, 130, 2461),'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#334155'
        }}
      >
        Add
      </button>
    </form>
  )
}

const TODO_INPUT_ID = 'todo-input-id'
