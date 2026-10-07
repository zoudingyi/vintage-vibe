import React from 'react';
import { Button } from 'react95';
import {
  careerProfile,
  projects,
  technicalStack,
  workExperience
} from '@/desktop/content/portfolio';
import PageHeader from '../PageHeader';

export default function ProjectsPage({ address, onNavigate }) {
  const searchParameters = new URLSearchParams(address.split('?')[1] || '');
  const selectedProjectId = searchParameters.get('project');

  return (
    <article className="vapornet-page vapornet-projects-page">
      <PageHeader
        eyebrow="ENGINEERING PROFILE // CD-028"
        title={careerProfile.title.toUpperCase()}
      >
        <p>
          复杂业务系统、前端架构与工程效率。这里收录我的技术能力、工作履历与代表项目。
        </p>
      </PageHeader>

      <section
        aria-label="Career snapshot"
        className="vapornet-career-snapshot"
      >
        <div className="vapornet-career-intro">
          <span className="vapornet-career-status">
            <i aria-hidden="true" /> PROFESSIONAL SIGNAL ONLINE
          </span>
          <h2>{careerProfile.name}</h2>
          <p>{careerProfile.summary}</p>
          <div className="vapornet-career-actions">
            <Button onClick={() => onNavigate(careerProfile.github)}>
              GitHub Profile
            </Button>
            <Button onClick={() => onNavigate(careerProfile.email)}>
              Contact Me
            </Button>
          </div>
        </div>
        <dl className="vapornet-career-stats">
          <div>
            <dt>EXPERIENCE</dt>
            <dd>{careerProfile.experience}</dd>
          </div>
          <div>
            <dt>BASE</dt>
            <dd>{careerProfile.location}</dd>
          </div>
          <div>
            <dt>WORK FILES</dt>
            <dd>{workExperience.length}</dd>
          </div>
          <div>
            <dt>PROJECT FILES</dt>
            <dd>{projects.length}</dd>
          </div>
        </dl>
      </section>

      <section
        aria-labelledby="technical-stack-heading"
        className="vapornet-technical-stack"
      >
        <div className="vapornet-project-section-heading">
          <div>
            <span>CAPABILITY MATRIX // PRODUCTION TOOLCHAIN</span>
            <h2 id="technical-stack-heading">TECHNICAL STACK</h2>
          </div>
          <strong>{technicalStack.length} SYSTEM LAYERS</strong>
        </div>
        <div className="vapornet-skill-grid">
          {technicalStack.map(group => (
            <article className="vapornet-skill-card" key={group.id}>
              <header>
                <span>{group.index}</span>
                <h3>{group.title}</h3>
              </header>
              <p>{group.description}</p>
              <ul>
                {group.technologies.map(technology => (
                  <li key={technology}>{technology}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section
        aria-labelledby="work-history-heading"
        className="vapornet-work-history"
      >
        <div className="vapornet-project-section-heading">
          <div>
            <span>WORK LOG // 2018 — 2024</span>
            <h2 id="work-history-heading">WORK HISTORY</h2>
          </div>
          <strong>CHENGDU / FRONTEND</strong>
        </div>
        <div className="vapornet-work-timeline">
          {workExperience.map((experience, index) => {
            const headingId = `work-history-${index}`;

            return (
              <article
                aria-labelledby={headingId}
                className="vapornet-work-entry"
                key={experience.company}
              >
                <div className="vapornet-work-period">
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <time>{experience.period}</time>
                </div>
                <div className="vapornet-work-copy">
                  <span>
                    {experience.role}
                    {' // '}
                    {experience.department}
                  </span>
                  <h3 id={headingId}>{experience.company}</h3>
                  <p>{experience.summary}</p>
                  <ul>
                    {experience.highlights.map(highlight => (
                      <li key={highlight}>{highlight}</li>
                    ))}
                  </ul>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section
        aria-labelledby="selected-project-files-heading"
        className="vapornet-project-archive"
      >
        <div className="vapornet-project-section-heading">
          <div>
            <span>CASE FILES // SELECTED DELIVERY RECORDS</span>
            <h2 id="selected-project-files-heading">
              SELECTED PROJECT FILES
            </h2>
          </div>
          <strong>{projects.length} FILES INDEXED</strong>
        </div>
        <div className="vapornet-project-list">
          {projects.map((project, index) => (
            <article
              aria-labelledby={`project-file-${project.id}`}
              className={
                selectedProjectId === project.id
                  ? 'vapornet-project-card is-selected'
                  : 'vapornet-project-card'
              }
              key={project.id}
            >
              <header>
                <span className="vapornet-project-number">
                  FILE {String(index + 1).padStart(2, '0')}
                </span>
                <span>{project.category}</span>
              </header>
              <h3 id={`project-file-${project.id}`}>{project.name}</h3>
              <p className="vapornet-project-role">
                {project.role}
                {' // '}
                {project.period}
              </p>
              <p>{project.summary}</p>
              <dl>
                <div>
                  <dt>Status</dt>
                  <dd>{project.status}</dd>
                </div>
                <div>
                  <dt>Stack</dt>
                  <dd>{project.stack}</dd>
                </div>
              </dl>
              <ul>
                {project.highlights.map(highlight => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
              {(project.github || project.demo) && (
                <Button
                  onClick={() => onNavigate(project.github || project.demo)}
                >
                  {project.linkLabel}
                </Button>
              )}
            </article>
          ))}
        </div>
      </section>

      <footer className="vapornet-project-footer">
        <span>EOF // ENGINEERING ARCHIVE</span>
        <p>偏好清晰的系统边界、可维护的组件，以及能够持续交付的工程流程。</p>
      </footer>
    </article>
  );
}
