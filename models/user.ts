export default class User {
  invitations: Set<string>;
  invitedBy: Set<string>;
  isPlaying: boolean;
  id: string;
  constructor(id: string) {
    this.id = id;
    this.isPlaying = false;
    this.invitedBy = new Set();
    this.invitations = new Set();
  }
}
