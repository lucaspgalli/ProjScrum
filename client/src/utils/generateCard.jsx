import { useState } from 'react';

export const useProjectCreation = () => {
  const [projectName, setProjectName] = useState('');
  const [projectDesc, setProjectDesc] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [projectMembers, setProjectMembers] = useState('');
  const [projectCards, setProjectCards] = useState(JSON.parse(localStorage.getItem('projects') || '[]'));

  const [year, month, day] = deliveryDate.split('-');
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  const formattedDate = date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const handleCreateProject = () => {
    if (!projectName || !projectDesc || !deliveryDate || !projectMembers) {
      return;
    }

    const newProject = {
      projectName,
      projectDesc,
      deliveryDate: formattedDate,
      projectMembers,
    };

    const storedProjects = JSON.parse(localStorage.getItem('projects') || '[]');
    storedProjects.push(newProject);
    localStorage.setItem('projects', JSON.stringify(storedProjects));

    setProjectCards((prevProjectCards) => [...prevProjectCards, newProject]);

    setProjectName('');
    setProjectDesc('');
    setDeliveryDate('');
    setProjectMembers('');
  };

  const isFormValid = projectName && projectDesc && deliveryDate && projectMembers;

  return {
    projectName,
    setProjectName,
    projectDesc,
    setProjectDesc,
    deliveryDate,
    setDeliveryDate,
    projectMembers,
    setProjectMembers,
    handleCreateProject,
    projectCards: projectCards.map((project) => (
      <div className='project-cards' key={project.projectName}>
        <h1>{project.projectName}</h1>
        <h2>{project.projectDesc}</h2>
        <h3>Data de entrega: {project.deliveryDate}</h3>
      </div>
    )),
    isFormValid,
  };
};