export const MESSAGE_TYPES = {
  // main to worker
  NEW_TASK: 'NEW_TASK',
  STOP_TASK: 'STOP_TASK',

  // worker to main
  TASK_UPDATE: 'TASK_UPDATE',
  TASK_COMPLETE: 'TASK_COMPLETE',
}

export const TASK_TYPES = {
  INITIALIZE: 'INITIALIZE',
  PROFILE: 'PROFILE',
}