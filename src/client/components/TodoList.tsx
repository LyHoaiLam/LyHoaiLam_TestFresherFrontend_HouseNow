import { useState, useRef, useEffect } from 'react'
import * as Tabs from '@radix-ui/react-tabs'
import * as Checkbox from '@radix-ui/react-checkbox'
import autoAnimate from '@formkit/auto-animate'

import { api } from '@/utils/client/api'
/**
 * QUESTION 3:
 * -----------
 * A todo has 2 statuses: "pending" and "completed"
 *  - "pending" state is represented by an unchecked checkbox
 *  - "completed" state is represented by a checked checkbox, darker background,
 *    and a line-through text
 *
 * We have 2 backend apis:
 *  - (1) `api.todo.getAll`       -> a query to get all todos
 *  - (2) `api.todoStatus.update` -> a mutation to update a todo's status
 *
 * Example usage for (1) is right below inside the TodoList component. For (2),
 * you can find similar usage (`api.todo.create`) in src/client/components/CreateTodoForm.tsx
 *
 * If you use VSCode as your editor , you should have intellisense for the apis'
 * input. If not, you can find their signatures in:
 *  - (1) src/server/api/routers/todo-router.ts
 *  - (2) src/server/api/routers/todo-status-router.ts
 *
 * Your tasks are:
 *  - Use TRPC to connect the todos' statuses to the backend apis
 *  - Style each todo item to reflect its status base on the design on Figma
 *
 * Documentation references:
 *  - https://trpc.io/docs/client/react/useQuery
 *  - https://trpc.io/docs/client/react/useMutation
 *
 *
 *
 *
 *
 * QUESTION 4:
 * -----------
 * Implement UI to delete a todo. The UI should look like the design on Figma
 *
 * The backend api to delete a todo is `api.todo.delete`. You can find the api
 * signature in src/server/api/routers/todo-router.ts
 *
 * NOTES:
 *  - Use the XMarkIcon component below for the delete icon button. Note that
 *  the icon button should be accessible
 *  - deleted todo should be removed from the UI without page refresh
 *
 * Documentation references:
 *  - https://www.sarasoueidan.com/blog/accessible-icon-buttons
 *
 *
 *
 *
 *
 * QUESTION 5:
 * -----------
 * Animate your todo list using @formkit/auto-animate package
 *
 * Documentation references:
 *  - https://auto-animate.formkit.com
 */

// QUESTION 3: Completedddd
// QUESTION 4: Completedddd
// QUESTION 5: Completedddd

export const TodoList = () => {
  const [activeTab, setActiveTab] = useState('all')
  const parent = useRef(null)

  // Fetch todos based on the active tab
  const { data: todos = [] } = api.todo.getAll.useQuery({
    statuses: activeTab === 'all' ? ['completed', 'pending'] : [activeTab],
  })

  useEffect(() => {
    if (parent.current) {
      console.log('parent: ', parent)
      autoAnimate(parent.current)
    }
  }, [parent.current])

  const apiContext = api.useContext()
  const { mutate: updateTodoStatus } = api.todoStatus.update.useMutation({
    onSuccess: () => {
      apiContext.todo.getAll.refetch()
    },
  })

  const { mutate: deleteTodo } = api.todo.delete.useMutation({
    onSuccess: () => {
      apiContext.todo.getAll.refetch()
    },
  })

  const handleStatusChange = (id, newStatus) => {
    updateTodoStatus({
      todoId: id,
      status: newStatus,
    })
  }

  const handleDelete = (id) => {
    deleteTodo({
      id: id,
    })
  }

  return (
    <div>
      <Tabs.Root
        defaultValue="all"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <Tabs.List className="flex space-x-4 border-b border-gray-200">
          <Tabs.Trigger
            value="all"
            className={`rounded-[20px] border-2 px-4 py-2 ${
              activeTab === 'all' ? 'bg-[#334155] text-white' : 'text-blue-500'
            }`}
          >
            All
          </Tabs.Trigger>
          <Tabs.Trigger
            value="pending"
            className={`rounded-[20px] border-2 px-4 py-2 ${
              activeTab === 'pending'
                ? 'bg-[#334155] text-white'
                : 'text-blue-500 bg-[#fff]'
            }`}
          >
            Pending
          </Tabs.Trigger>
          <Tabs.Trigger
            value="completed"
            className={`rounded-[20px] border-2 px-4 py-2 ${
              activeTab === 'completed'
                ? 'bg-[#334155] text-white'
                : 'text-blue-500 border-2 bg-[#fff]'
            }`}
          >
            Completed
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="all">
          <ul className="grid grid-cols-1 gap-y-3" ref={parent}>
            {todos.map((todo) => (
              <li key={todo.id}>
                <div
                  className={`flex items-center rounded-12 border border-gray-200 px-4 py-3 shadow-sm ${
                    todo.status === 'completed' ? 'bg-gray-200' : ''
                  }`}
                >
                  <Checkbox.Root
                    id={String(todo.id)}
                    checked={todo.status === 'completed'}
                    onCheckedChange={() =>
                      handleStatusChange(
                        todo.id,
                        todo.status === 'completed' ? 'pending' : 'completed'
                      )
                    }
                    className="flex h-6 w-6 items-center justify-center rounded-6 border border-gray-300 focus:border-gray-700 focus:outline-none data-[state=checked]:border-gray-700 data-[state=checked]:bg-gray-700"
                  >
                    <Checkbox.Indicator>
                      <CheckIcon className="h-4 w-4 text-white" />
                    </Checkbox.Indicator>
                  </Checkbox.Root>

                  <label
                    className={`block pl-3 font-medium ${
                      todo.status === 'completed'
                        ? 'text-gray-500 line-through'
                        : ''
                    }`}
                    htmlFor={String(todo.id)}
                  >
                    {todo.body}
                  </label>

                  <button
                    onClick={() => handleDelete(todo.id)}
                    aria-label={`Delete todo ${todo.body}`}
                    className="hover:text-red-600 focus:ring-red-600 ml-auto rounded-full p-1 text-gray-400 focus:outline-none focus:ring-2"
                  >
                    <XMarkIcon className="hover:bg-red-500 hover:border-red-500 h-6 w-6 rounded-full text-gray-400 transition-colors duration-300 hover:border-2" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </Tabs.Content>
        <Tabs.Content value="pending">
          <ul className="grid grid-cols-1 gap-y-3" ref={parent}>
            {todos
              .filter((todo) => todo.status === 'pending')
              .map((todo) => (
                <li key={todo.id}>
                  <div
                    className={`flex items-center rounded-12 border border-gray-200 px-4 py-3 shadow-sm ${
                      todo.status === 'completed' ? 'bg-gray-200' : ''
                    }`}
                  >
                    <Checkbox.Root
                      id={String(todo.id)}
                      checked={todo.status === 'completed'}
                      onCheckedChange={() =>
                        handleStatusChange(
                          todo.id,
                          todo.status === 'completed' ? 'pending' : 'completed'
                        )
                      }
                      className="flex h-6 w-6 items-center justify-center rounded-6 border border-gray-300 focus:border-gray-700 focus:outline-none data-[state=checked]:border-gray-700 data-[state=checked]:bg-gray-700"
                    >
                      <Checkbox.Indicator>
                        <CheckIcon className="h-4 w-4 text-white" />
                      </Checkbox.Indicator>
                    </Checkbox.Root>

                    <label
                      className={`block pl-3 font-medium ${
                        todo.status === 'completed'
                          ? 'text-gray-500 line-through'
                          : ''
                      }`}
                      htmlFor={String(todo.id)}
                    >
                      {todo.body}
                    </label>

                    <button
                      onClick={() => handleDelete(todo.id)}
                      aria-label={`Delete todo ${todo.body}`}
                      className="hover:text-red-600 focus:ring-red-600 ml-auto rounded-full p-1 text-gray-400 focus:outline-none focus:ring-2"
                    >
                      <XMarkIcon className="hover:bg-red-500 hover:border-red-500 h-6 w-6 rounded-full text-gray-400 transition-colors duration-300 hover:border-2" />
                    </button>
                  </div>
                </li>
              ))}
          </ul>
        </Tabs.Content>
        <Tabs.Content value="completed">
          <ul className="grid grid-cols-1 gap-y-3" ref={parent}>
            {todos
              .filter((todo) => todo.status === 'completed')
              .map((todo) => (
                <li key={todo.id}>
                  <div
                    className={`flex items-center rounded-12 border border-gray-200 px-4 py-3 shadow-sm ${
                      todo.status === 'completed' ? 'bg-gray-200' : ''
                    }`}
                  >
                    <Checkbox.Root
                      id={String(todo.id)}
                      checked={todo.status === 'completed'}
                      onCheckedChange={() =>
                        handleStatusChange(
                          todo.id,
                          todo.status === 'completed' ? 'pending' : 'completed'
                        )
                      }
                      className="flex h-6 w-6 items-center justify-center rounded-6 border border-gray-300 focus:border-gray-700 focus:outline-none data-[state=checked]:border-gray-700 data-[state=checked]:bg-gray-700"
                    >
                      <Checkbox.Indicator>
                        <CheckIcon className="h-4 w-4 text-white" />
                      </Checkbox.Indicator>
                    </Checkbox.Root>

                    <label
                      className={`block pl-3 font-medium ${
                        todo.status === 'completed'
                          ? 'text-gray-500 line-through'
                          : ''
                      }`}
                      htmlFor={String(todo.id)}
                    >
                      {todo.body}
                    </label>

                    <button
                      onClick={() => handleDelete(todo.id)}
                      aria-label={`Delete todo ${todo.body}`}
                      className="hover:text-red-600 focus:ring-red-600 ml-auto rounded-full p-1 text-gray-400 focus:outline-none focus:ring-2"
                    >
                      <XMarkIcon className="hover:bg-red-500 hover:border-red-500 h-6 w-6 rounded-full text-gray-400 transition-colors duration-300 hover:border-2" />
                    </button>
                  </div>
                </li>
              ))}
          </ul>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  )
}

const XMarkIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  )
}

const CheckIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.5 12.75l6 6 9-13.5"
      />
    </svg>
  )
}
