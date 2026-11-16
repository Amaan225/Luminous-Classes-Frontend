// The admin ledger tracks recorded successful lead unlocks, not legacy free applications.
export function approvedUnlocksForJob(unlocks, jobId) {
  return unlocks.filter(unlock => {
    const linkedJobId = unlock.jobId?._id ?? unlock.jobId;
    return unlock.status === 'Approved' && typeof linkedJobId === 'string' && linkedJobId === jobId;
  });
}
