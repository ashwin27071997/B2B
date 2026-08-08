import { useAuth } from '@/providers';
import { Button } from '@/components';
import styles from './Dashboard.module.css';

export const Dashboard = () => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.title}>Welcome back!</h1>
          <p className={styles.subtitle}>
            Signed in as{' '}
            <span className={styles.email}>{user?.email}</span>
          </p>
        </div>

        <div className={styles.card}>
          <div className={styles.userInfo}>
            {user?.avatarUrl && (
              <img
                src={user.avatarUrl}
                alt={user.fullName || 'User avatar'}
                className={styles.avatar}
              />
            )}
            <div>
              <p className={styles.userName}>{user?.fullName || 'User'}</p>
              <p className={styles.userEmail}>{user?.email}</p>
            </div>
          </div>

          <p className={styles.placeholder}>
            This is a placeholder dashboard. Your app content goes here.
          </p>

          <Button variant="secondary" onClick={handleSignOut}>
            Sign out
          </Button>
        </div>
      </div>
    </div>
  );
};
