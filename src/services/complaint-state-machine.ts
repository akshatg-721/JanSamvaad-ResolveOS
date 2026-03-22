import { COMPLAINT_STATUS, STATUS_TRANSITIONS } from '../constants/complaint.constants';
import { Role } from '../types';
import { ForbiddenError, ValidationError } from '../lib/error-handler';

export class ComplaintStateMachine {
  constructor(private readonly currentState: COMPLAINT_STATUS) {}

  getAvailableTransitions(): COMPLAINT_STATUS[] {
    return STATUS_TRANSITIONS[this.currentState] || [];
  }

  canTransitionTo(newState: COMPLAINT_STATUS): boolean {
    return this.getAvailableTransitions().includes(newState);
  }

  validateTransition(newState: COMPLAINT_STATUS, actorRole: Role, isOwner = false): void {
    if (!this.canTransitionTo(newState)) {
      throw new ValidationError(`Invalid transition from ${this.currentState} to ${newState}`);
    }

    // Role-based restrictions
    if (newState === COMPLAINT_STATUS.CLOSED) {
      if (actorRole !== Role.ADMIN && actorRole !== Role.OFFICIAL) {
        throw new ForbiddenError('Only admins can close complaints');
      }
    }

    // Owner/admin can reopen from RESOLVED.
    if (this.currentState === COMPLAINT_STATUS.RESOLVED && newState === COMPLAINT_STATUS.IN_PROGRESS) {
      if (!isOwner && actorRole !== Role.ADMIN) {
        throw new ForbiddenError('Only the original user or an admin can reopen a resolved complaint');
      }
    }

    // CLOSED is terminal for citizens; only admins/officials can reopen.
    if (this.currentState === COMPLAINT_STATUS.CLOSED && newState === COMPLAINT_STATUS.IN_PROGRESS) {
      if (actorRole !== Role.ADMIN && actorRole !== Role.OFFICIAL) {
        throw new ForbiddenError('Only officials can reopen a closed complaint');
      }
    }

    // Normal progression requires OFFICIAL/ADMIN
    if ([COMPLAINT_STATUS.ACKNOWLEDGED, COMPLAINT_STATUS.IN_PROGRESS, COMPLAINT_STATUS.RESOLVED, COMPLAINT_STATUS.REJECTED].includes(newState)) {
      if (actorRole !== Role.ADMIN && actorRole !== Role.OFFICIAL) {
        throw new ForbiddenError('Only officials can perform state progressions like Acknowledging or Resolving complaints');
      }
    }
  }

  transition(newState: COMPLAINT_STATUS, actorRole: Role, isOwner = false): COMPLAINT_STATUS {
    this.validateTransition(newState, actorRole, isOwner);
    return newState; // The repository layer actually saves it
  }
}
