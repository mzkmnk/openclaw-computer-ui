import { Navigate, Route, Routes, useParams } from 'react-router';

function TaskNewPage() {
  return <h1>Task New</h1>;
}

function TaskListPage() {
  return <h1>Task List</h1>;
}

function TaskDetailPage() {
  const { id } = useParams();
  return <h1>Task Detail: {id}</h1>;
}

function ApprovalsPage() {
  return <h1>Approvals</h1>;
}

export function App() {
  return (
    <main>
      <Routes>
        <Route path="/" element={<Navigate to="/tasks" replace />} />
        <Route path="/tasks" element={<TaskListPage />} />
        <Route path="/tasks/new" element={<TaskNewPage />} />
        <Route path="/tasks/:id" element={<TaskDetailPage />} />
        <Route path="/approvals" element={<ApprovalsPage />} />
      </Routes>
    </main>
  );
}
