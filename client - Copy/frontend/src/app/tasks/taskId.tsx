import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../firebase/firebaseConfig";
import TopNavbar from "../components/navbar/TopNavbar";

const TaskDetailPage = () => {
  const router = useRouter();
  const { id } = router.query; 
  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTaskDetail = async () => {
      if (id) {
        try {
          const taskRef = doc(firestore, "tasks", id as string);
          const taskDoc = await getDoc(taskRef);

          if (taskDoc.exists()) {
            setTask(taskDoc.data());
          } else {
            console.log("No such document!");
          }
        } catch (error) {
          console.error("Error fetching task details:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchTaskDetail();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!task) {
    return <div>Task not found</div>;
  }

  return (
    <>
      <TopNavbar />
      <div className="container mx-auto p-8">
        <h2 className="text-2xl font-bold mb-4">{task.title}</h2>
        <p className="text-lg font-medium">Posted by: {task.companyName}</p>
        <p className="text-gray-500 text-sm mt-2">Posted on: {new Date(task.createdAt.seconds * 1000).toLocaleDateString()}</p>
        <p className="mt-4 text-gray-700">{task.jobDescription}</p>
        <p className="mt-2 text-lg font-semibold">Payment: {task.payment}</p>
        <p className="mt-2 text-lg font-semibold">Location: {task.location}</p>
        <p className="mt-2 text-lg font-semibold">Skills Required: {task.skills.join(", ")}</p>
      </div>
    </>
  );
};

export default TaskDetailPage;
