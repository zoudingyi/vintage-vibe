import {
  fireEvent,
  render,
  screen,
  waitFor,
  within
} from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { theSixtiesUSA } from 'react95/dist/themes';
import GuestbookContent, {
  archivedGuestbookEntries
} from './GuestbookContent';
import { createLocalGuestbookRepository } from './guestbookRepository';

beforeEach(() => {
  window.localStorage.clear();
});

function renderGuestbooks(repository) {
  return render(
    <ThemeProvider theme={theSixtiesUSA}>
      <div aria-label="First guestbook">
        <GuestbookContent repository={repository} />
      </div>
      <div aria-label="Second guestbook">
        <GuestbookContent repository={repository} />
      </div>
    </ThemeProvider>
  );
}

test('synchronizes a new signature across mounted guestbook views', async () => {
  const repository = createLocalGuestbookRepository({
    createId: () => 'shared-entry',
    now: () => new Date('2026-07-26T14:18:00.000Z')
  });
  renderGuestbooks(repository);
  const firstGuestbook = screen.getByLabelText('First guestbook');
  const secondGuestbook = screen.getByLabelText('Second guestbook');

  await within(firstGuestbook).findByText(/no signatures yet/i);
  await within(secondGuestbook).findByText(/no signatures yet/i);

  fireEvent.change(
    within(firstGuestbook).getByLabelText(/guestbook name/i),
    {
      target: { value: 'Ada' }
    }
  );
  fireEvent.change(
    within(firstGuestbook).getByLabelText(/guestbook message/i),
    {
      target: { value: 'Received by both terminals.' }
    }
  );
  fireEvent.click(
    within(firstGuestbook).getByRole('button', {
      name: /sign guestbook/i
    })
  );

  await waitFor(() => {
    expect(within(secondGuestbook).getByText('Ada')).toBeInTheDocument();
  });
  expect(
    within(secondGuestbook).getByText(/received by both terminals/i)
  ).toBeInTheDocument();
});

test('shows field-level feedback without writing an empty signature', async () => {
  const repository = createLocalGuestbookRepository();

  render(
    <ThemeProvider theme={theSixtiesUSA}>
      <GuestbookContent repository={repository} />
    </ThemeProvider>
  );
  await screen.findByText(/no signatures yet/i);

  fireEvent.click(screen.getByRole('button', { name: /sign guestbook/i }));

  expect(screen.getByText(/please enter your name/i)).toBeInTheDocument();
  expect(screen.getByText(/please enter a message/i)).toBeInTheDocument();
  expect(window.localStorage.getItem('vintage-vibe-guestbook')).toBeNull();
});

test('shows page-only node context and updates the signature preview', async () => {
  const repository = createLocalGuestbookRepository();

  render(
    <ThemeProvider theme={theSixtiesUSA}>
      <GuestbookContent
        archivedEntries={archivedGuestbookEntries}
        mode="page"
        repository={repository}
      />
    </ThemeProvider>
  );

  const nodeStatus = await screen.findByRole('region', {
    name: /node status/i
  });
  expect(within(nodeStatus).getByText(/^signatures$/i)).toBeInTheDocument();
  expect(within(nodeStatus).getByText(/^archived$/i)).toBeInTheDocument();
  expect(
    within(nodeStatus).getByText(/^last transmission$/i)
  ).toBeInTheDocument();
  expect(within(nodeStatus).getByText(/^message limit$/i)).toBeInTheDocument();
  expect(within(nodeStatus).queryByText(/^storage$/i)).not.toBeInTheDocument();
  expect(
    within(nodeStatus).queryByText(/^connection$/i)
  ).not.toBeInTheDocument();

  const preview = screen.getByRole('region', {
    name: /signature preview/i
  });
  expect(within(preview).getByText(/not yet transmitted/i)).toBeInTheDocument();

  fireEvent.change(screen.getByLabelText(/guestbook name/i), {
    target: { value: 'Ada' }
  });
  fireEvent.change(screen.getByLabelText(/guestbook message/i), {
    target: { value: 'A small signal from the future.' }
  });

  expect(within(preview).getByText('Ada')).toBeInTheDocument();
  expect(
    within(preview).getByText(/a small signal from the future/i)
  ).toBeInTheDocument();
});
