import { render, screen } from '@testing-library/react';
import App from './App';

test('opens the cinematic start screen with the retro computer entrance', () => {
  render(<App />);

  expect(
    screen.getByRole('heading', { name: /vintage vibe/i })
  ).toBeInTheDocument();
  expect(
    screen.getByRole('button', { name: '启动复古电脑，进入桌面' })
  ).toBeEnabled();
  expect(
    screen.getByRole('button', { name: '按下电源键，进入桌面' })
  ).toBeEnabled();
  expect(
    screen.getByText(/a personal world by devo zou/i)
  ).toBeInTheDocument();
  expect(screen.getByText('あの頃の未来へ、ようこそ。'))
    .toHaveAttribute('lang', 'ja');
  expect(screen.queryByRole('navigation', { name: /入口样式预览/ }))
    .not.toBeInTheDocument();
});
