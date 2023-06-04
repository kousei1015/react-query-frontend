import NewTodo from "./../components/NewTodo";
import axios, { isAxiosError } from "axios";
import { useQuery, useQueryClient, useMutation } from "react-query";

interface TodoProps {
  todos: {
    id: number;
    title: string;
  }[];
}
const Todo = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery(["todos"], () =>
    axios.get<TodoProps>("http://localhost:3000/api/v1/todos")
  );

  const deleteTodo = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3000/api/v1/todos/${id}`);
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
    }
  };
  const deleteMutation = useMutation(deleteTodo, {
    onSuccess: () => {
      queryClient.invalidateQueries(["todos"]);
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>error</div>;
  }
  
  return (
    <>
      <NewTodo />
      <div style={{ textAlign: "center" }}>
        {data?.data.todos.map((todo) => (
          <div key={todo.id}>
            {todo.title}
            <button
              onClick={() => {
                deleteMutation.mutate(todo.id);
              }}
            >
              消去する
            </button>
          </div>
        ))}
      </div>
    </>
  );
};

export default Todo;
