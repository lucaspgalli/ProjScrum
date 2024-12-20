import React, { useState, useEffect } from 'react';
import '../assets/styles/HistoricoMainContent.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { projectService } from '../services/api';

const HistoricoMainContent = ({ isNavbarVisible }) => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedSprint, setSelectedSprint] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const fetchedProjects = await projectService.getProjetos();

        const projectsWithEndedSprints = await Promise.all(
          fetchedProjects.map(async (project) => {
            const endedSprints = await projectService.getEndedSprintsByProjectId(project.id);
            return { ...project, endedSprints };
          })
        );

        setProjects(projectsWithEndedSprints);
      } catch (error) {
        console.error('Erro ao buscar projetos:', error);
      }
    };

    fetchProjects();
  }, []);

  const handleProjectSelect = (projectId) => {
    const project = projects.find((project) => project.id === projectId);
    setSelectedProject(project);
    setSelectedSprint(null);
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSprintSelect = (sprint) => {
    setSelectedSprint(sprint);
  };

  return (
    <div className={`history-main-container ${isNavbarVisible ? '' : 'full-width'}`}>
      <div className='history-list'>
        <ul className='project-list'>
          {projects.map((project) => (
            <li key={project.id}>
              <div className='project-name' onClick={() => handleProjectSelect(project.id)}>
                {project.projectName}
                <FontAwesomeIcon
                  className='dropdown-icon'
                  icon={isDropdownOpen && selectedProject?.id === project.id ? faAngleUp : faAngleDown}
                />
              </div>
              {isDropdownOpen && selectedProject?.id === project.id && (
                <ul className='ended-sprints-list'>
                  {project.endedSprints.map((endedSprint, index) => (
                    <li key={`${endedSprint.id}-${index}`} onClick={() => handleSprintSelect(endedSprint)}>
                      {endedSprint.name}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className='history-content'>
        {selectedSprint && (
          <div className='sprint-details'>
            <h1>{selectedSprint.name}</h1>
            <div className='evaluation'>
              <h3>Avaliação da Sprint</h3>
              <ul>
                <li>Atividades: {selectedSprint.evaluationScores.atividades}</li>
                <li>Equipe: {selectedSprint.evaluationScores.equipe}</li>
                <li>Comunicação: {selectedSprint.evaluationScores.comunicacao}</li>
                <li>Entregas: {selectedSprint.evaluationScores.entregas}</li>
              </ul>
            </div>
            <div className='dailys-container'>
              <div className='daily-header'>
                <div className='pending'>Pendente</div>
                <div className='in-progress'>Em progresso</div>
                <div className='completed'>Concluido</div>
              </div>
              <div className='daily-cards'>
                <div className='pending-container'>
                  {selectedSprint.dailies
                    .filter((daily) => daily.tag === 'Pendente')
                    .map((daily) => (
                      <div key={daily.id} className='daily-card'>
                        <h4>{daily.name}</h4>
                        <p>{daily.description}</p>
                      </div>
                    ))}
                </div>
                <div className='in-progress-container'>
                  {selectedSprint.dailies
                    .filter((daily) => daily.tag === 'Em progresso')
                    .map((daily) => (
                      <div key={daily.id} className='daily-card'>
                        <h4>{daily.name}</h4>
                        <p>{daily.description}</p>
                      </div>
                    ))}
                </div>
                <div className='completed-container'>
                  {selectedSprint.dailies
                    .filter((daily) => daily.tag === 'Concluido')
                    .map((daily) => (
                      <div key={daily.id} className='daily-card'>
                        <h4>{daily.name}</h4>
                        <p>{daily.description}</p>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoricoMainContent;
