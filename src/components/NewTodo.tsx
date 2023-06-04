import React, { useState } from "react";
import axios from "axios";
import { useMutation, useQueryClient } from "react-query";

const NewTodo = () => {
  const [text, setText] = useState("");
  const queryClient = useQueryClient();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const addTodo = async () => {
    const title = {
      title: text,
    };
    const res = await axios.post("http://localhost:3000/api/v1/todos", title, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data;
  };

  const addMutation = useMutation(addTodo, {
    onSuccess: () => queryClient.invalidateQueries(["todos"]),
  });

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    addMutation.mutate();
    setText("");
  };

  return (
    <div style={{ margin: "50px auto", textAlign: "center" }}>
      <input type="text" value={text} onChange={onChange} />
      <button onClick={handleSubmit}>送信</button>
    </div>
  );
};

export default NewTodo;
