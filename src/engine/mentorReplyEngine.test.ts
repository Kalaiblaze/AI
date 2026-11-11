import test from 'node:test';
import assert from 'node:assert/strict';
import {
  classifyUserIntent,
  generateDynamicMentorFallback
} from './mentorReplyEngine';
import { NEAT_PILLARS } from './nexusNeatEngine';

test('classifyUserIntent distinguishes casual greetings, meeting/career questions, failure autopsies, and domain deep-dives', () => {
  assert.equal(classifyUserIntent('Hi'), 'CASUAL_GREETING');
  assert.equal(classifyUserIntent('Vanakkam boss!'), 'CASUAL_GREETING');
  assert.equal(
    classifyUserIntent('Give me 1 First-Principles question to ask in meetings'),
    'MEETING_OR_CAREER_QUESTION'
  );
  assert.equal(
    classifyUserIntent('How does this connect to career & engineering skills?'),
    'MEETING_OR_CAREER_QUESTION'
  );
  assert.equal(
    classifyUserIntent('Why did Intel and Nokia fail?'),
    'FAILURE_OR_WINNER_QUESTION'
  );
  assert.equal(
    classifyUserIntent('Explain Yttrium/Scandium shortages and V4L2 DMA-BUF pipelines'),
    'DOMAIN_DEEP_DIVE'
  );
});

test('generateDynamicMentorFallback never repeats a fixed 3-bullet stamp across different intents', () => {
  const techPillar = NEAT_PILLARS.TECH;

  const hiReply = generateDynamicMentorFallback('Hi', techPillar);
  const meetingReply = generateDynamicMentorFallback(
    'Give me 1 First-Principles question to ask in meetings',
    techPillar
  );
  const deepDiveReply = generateDynamicMentorFallback(
    'Deep dive into 2nm silicon and V4L2',
    techPillar
  );

  // Casual greeting is 1-2 conversational sentences without bullet dumps
  assert.ok(hiReply.length < 260);
  assert.ok(!hiReply.includes('•'));

  // Meeting reply gives concrete meeting questions & room psychology
  assert.ok(meetingReply.includes('The Bottleneck Probe'));
  assert.ok(!meetingReply.includes('Past ➔ Future Trajectory:'));

  // Deep dive gives rich engineering mechanics without the old 1-2-3 robotic template
  assert.ok(deepDiveReply.includes('The Real Engineering & Supply-Chain Mechanics'));
  assert.ok(!deepDiveReply.includes('1. Thunglish Analogy:'));
});
