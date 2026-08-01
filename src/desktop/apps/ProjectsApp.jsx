import React, { useState } from 'react';
import { Anchor, Button, Fieldset, Panel } from 'react95';
import { projects } from './data';

export default function ProjectsApp() {
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0].id);
  const selectedProject = projects.find(item => item.id === selectedProjectId);

  return (
    <div className="projects-app">
      <Panel variant="well" className="projects-sidebar">
        <strong>Projects Explorer</strong>
        {projects.map(project => (
          <Button
            fullWidth
            onClick={() => setSelectedProjectId(project.id)}
            active={selectedProjectId === project.id}
            key={project.id}
          >
            {project.name}
          </Button>
        ))}
      </Panel>
      <Fieldset label={selectedProject.name} className="projects-detail">
        <p>{selectedProject.summary}</p>
        <p>Status: {selectedProject.status}</p>
        <p>Stack: {selectedProject.stack}</p>
        {(selectedProject.github || selectedProject.demo) && (
          <div className="projects-links">
            {selectedProject.github && (
              <Anchor
                href={selectedProject.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                Project GitHub
              </Anchor>
            )}
            {selectedProject.demo && (
              <Anchor
                href={selectedProject.demo}
                target="_blank"
                rel="noopener noreferrer"
              >
                Documentation
              </Anchor>
            )}
          </div>
        )}
      </Fieldset>
    </div>
  );
}
