import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import JobCard from './JobCard';
import { firestore } from '../../firebase/firebaseConfig'; 

const TasksPage = () => {
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, "tasks"));
        const taskData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        console.log(taskData);
        setTasks(taskData);
      } catch (error) {
        console.error("Error fetching tasks: ", error);
      }
    };
    fetchTasks();
  }, []);


  return (
    <div className="task-list">
      {tasks.length === 0 ? (
        <div>No tasks available</div>
      ) : (
        tasks.map((task) => (
          <JobCard
            key={task.id}
            job={{
              companyLogo_userimage: '', 
              companyName: task.postedBy,
              createdAt: task.createdAt?.toDate().toLocaleString() || 'Unknown',
              title: task.title,
              jobDescription: task.description,
              location: 'Unknown', 
              category: task.category,
              taskersNeeded: task.taskersNeeded,
              duration: task.duration,
              skills: task.skill.split(' , '),
              favorite: true,
              bidAvailabele: task.jobBidding,
              payRange: task.payment
            }}
            onJobClick={handleTaskClick}
          />
        ))
      )}
    </div>
  );
};

export default TaskList;
