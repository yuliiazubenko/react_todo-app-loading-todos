/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, USER_ID } from './api/todos';
import { TodoList } from './components/TodoList/TodoList';
import { Todo } from './types/Todo';
import { Footer } from './components/Footer/Footer';
import { ErrorMessages } from './types/Errors';
import { Errors } from './components/Errors/Errors';
import { Header } from './components/Header/Header';
import { Filters } from './types/Filters';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filters>(Filters.ALL);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(ErrorMessages.UnableToLoad);
        setTimeout(() => setErrorMessage(''), 3000);
      });
  }, []);

  const filteredTodos = todos.filter(todo => {
    if (filter === Filters.COMPLETED) {
      return todo.completed;
    }

    if (filter === Filters.ACTIVE) {
      return !todo.completed;
    }

    return true;
  });

  const activeTodosCount = todos.filter(todo => !todo.completed).length;

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header />
        {todos.length > 0 && <TodoList todos={filteredTodos} />}
        {todos.length > 0 && (
          <Footer
            activeTodosCount={activeTodosCount}
            setFilter={setFilter}
            filter={filter}
          />
        )}
      </div>
      <Errors
        errorMessage={errorMessage}
        clearError={() => setErrorMessage('')}
      />
    </div>
  );
};
