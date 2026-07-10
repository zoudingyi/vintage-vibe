import React, { useState } from 'react';
import { Fieldset, Tab, TabBody, Tabs } from 'react95';

const profileTabs = {
  overview: {
    title: 'Overview',
    content: (
      <>
        <p>
          <strong>Frontend System</strong>
        </p>
        <p>
          Building playful React interfaces with clear component architecture
          and system-like interactions.
        </p>
      </>
    )
  },
  skills: {
    title: 'Skills',
    content: (
      <>
        <p>React and component architecture</p>
        <p>Interactive UI systems</p>
        <p>Accessible, test-driven frontend development</p>
      </>
    )
  },
  contact: {
    title: 'Contact',
    content: (
      <>
        <p>Email: 18483641399@163.com</p>
        <p>GitHub: zoudingyi</p>
      </>
    )
  }
};

export default function ProfileApp() {
  const [activeTab, setActiveTab] = useState('overview');
  const selectedTab = profileTabs[activeTab];

  return (
    <div className="profile-app">
      <Tabs value={activeTab} onChange={setActiveTab}>
        {Object.entries(profileTabs).map(([value, tab]) => (
          <Tab value={value} key={value}>
            {tab.title}
          </Tab>
        ))}
      </Tabs>
      <TabBody>
        <Fieldset label={selectedTab.title}>{selectedTab.content}</Fieldset>
      </TabBody>
    </div>
  );
}
