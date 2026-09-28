// Campus Connect Portal - PortalView Parent Component (Experiment 5 & Full-Stack Integration)
// Demonstrates Component-Based Architecture, Props composition, State management, Event handling, and Live Express API integration

import { useState, useEffect } from 'react';
import PortalHeader from './PortalHeader.jsx';
import TabBar from './TabBar.jsx';
import ItemCard from './ItemCard.jsx';
import DetailModal from './DetailModal.jsx';

export default function PortalView({ role = 'student', onBack }) {
  // 1. Tab State: manages active view tab
  const [activeTab, setActiveTab] = useState(role === 'admin' ? 'users' : 'notices');

  // 2. Modal State: manages active detail popup
  const [selectedItem, setSelectedItem] = useState(null);

  // 3. Dynamic Assignment State: synced with Express server
  const [assignments, setAssignments] = useState([
    {
      id: 1,
      subject: 'CS3301 - Full Stack',
      title: 'Lab Assignment 2: React Routing',
      status: 'Pending',
      dueDate: 'Sept 15, 2026',
      meta: 'Instructor: Prof. K. Rao • Due: Sept 15, 2026 • Max Marks: 20',
      description: 'Implement modular frontend application using React component architecture with props and state.'
    },
    {
      id: 2,
      subject: 'CS3302 - DBMS',
      title: 'ER Diagram Project Report',
      status: 'Submitted',
      dueDate: 'Sept 01, 2026',
      meta: 'Instructor: Dr. S. Sharma • Due: Sept 01, 2026 • Max Marks: 25',
      description: 'Design BCNF and 3NF relational schemas for a real-time university course registration system.'
    }
  ]);

  // Fetch live assignments from Express API on mount
  useEffect(() => {
    fetch('http://localhost:5000/api/assignments')
      .then((res) => res.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : data.data || [];
        if (list.length > 0) {
          setAssignments((prev) => {
            const idMap = new Map(prev.map((a) => [a.id, a]));
            list.forEach((item) => {
              idMap.set(item.id, {
                ...item,
                meta: item.meta || `Course: ${item.subject} • Due: ${item.dueDate || 'Sept 30, 2026'}`,
                description: item.description || `Assignment for ${item.subject}`
              });
            });
            return Array.from(idMap.values());
          });
        }
      })
      .catch((err) => {
        console.warn('Backend server not connected; using local assignment state:', err.message);
      });
  }, []);

  // 4. Dynamic Attendance State
  const [attendance, setAttendance] = useState([
    { id: 'att-1', course: 'CS3301 Full Stack Development', attended: 28, total: 32 },
    { id: 'att-2', course: 'CS3302 Database Management Systems', attended: 30, total: 34 },
    { id: 'att-3', course: 'CS3303 Design & Analysis of Algorithms', attended: 27, total: 30 },
    { id: 'att-4', course: 'CS3304 Software Engineering Practices', attended: 24, total: 28 }
  ]);

  // 5. Profile Status State
  const [profileStatus, setProfileStatus] = useState('Enrolled - Semester V (Academic Year 2026-27)');

  // 6. Notices State
  const [notices, setNotices] = useState([
    {
      id: 'not-1',
      title: 'Mid-Term Exam Schedule Released',
      dept: 'SOCSE',
      date: 'Sept 10, 2026',
      meta: 'SOCSE • Sept 10, 2026',
      badge: 'Urgent',
      badgeType: 'urgent',
      description: 'The Mid-Term Examination timetable for Odd Semester 2026 is officially published. All students are advised to check their hall tickets on the portal.',
      details: 'Exams commence October 3, 2026. Hall tickets will be distributed in departmental offices from Sept 25.'
    },
    {
      id: 'not-2',
      title: 'Hackathon Registration Open',
      dept: 'RVU Tech Club',
      date: 'Sept 15, 2026',
      meta: 'RVU Tech Club • Sept 15, 2026',
      badge: 'New',
      badgeType: 'new',
      description: 'Annual RV University National Hackathon 2026. Build innovative solutions for smart campus, edtech, and decentralized platforms.',
      details: 'Teams of 2 to 4 members. Total prize pool ₹1,50,000. Registration closes Sept 28, 2026.'
    },
    {
      id: 'not-3',
      title: 'Academic Calendar Update - Odd Sem 2026',
      dept: 'Controller of Examinations',
      date: 'Sept 05, 2026',
      meta: 'Controller of Examinations • Sept 05, 2026',
      badge: 'Official',
      badgeType: 'new',
      description: 'Revised timelines for internal continuous assessments, laboratory evaluations, and mid-semester reviews.',
      details: 'All assessments must conclude before Diwali recess as per academic senate directives.'
    }
  ]);

  // 7. Faculty State: New Assignment Form
  const [newAssignmentForm, setNewAssignmentForm] = useState({
    subject: 'CS3301 - Full Stack',
    title: '',
    dueDate: 'Oct 15, 2026'
  });
  const [facultyPostSuccess, setFacultyPostSuccess] = useState('');

  // 8. Faculty State: New Notice Form
  const [newNoticeForm, setNewNoticeForm] = useState({
    title: '',
    dept: 'SOCSE Faculty',
    description: ''
  });

  // 9. Faculty Submissions List
  const [submissions, setSubmissions] = useState([
    { id: 101, student: 'Alex Johnson', subject: 'CS3301 Full Stack', assignment: 'Lab Assignment 2', submittedAt: 'Sept 14, 2026', grade: 'Pending' },
    { id: 102, student: 'Dhruvi Mittal', subject: 'CS3301 Full Stack', assignment: 'Lab Assignment 2', submittedAt: 'Sept 15, 2026', grade: '20 / 20 (A+)' },
    { id: 103, student: 'Rahul Verma', subject: 'CS3302 DBMS', assignment: 'ER Diagram Project', submittedAt: 'Sept 01, 2026', grade: '24 / 25' }
  ]);

  // 10. Admin Users State
  const [usersList, setUsersList] = useState([
    { id: 1, name: 'Dhruvi Mittal', email: 'dhruvi@rvu.edu.in', role: 'Student', dept: 'SOCSE', status: 'Active' },
    { id: 2, name: 'Prof. K. Rao', email: 'krao@rvu.edu.in', role: 'Faculty', dept: 'SOCSE', status: 'Active' },
    { id: 3, name: 'Dr. S. Sharma', email: 'ssharma@rvu.edu.in', role: 'Faculty', dept: 'SOCSE', status: 'Active' },
    { id: 4, name: 'Admin Operations', email: 'admin@rvu.edu.in', role: 'Admin', dept: 'IT Services', status: 'Active' },
    { id: 5, name: 'Rahul Verma', email: 'rahul.v@rvu.edu.in', role: 'Student', dept: 'SOCSE', status: 'Active' }
  ]);

  // 11. Admin System Diagnostics State
  const [serverHealth, setServerHealth] = useState({
    status: 'Checking...',
    uptime: 'N/A',
    timestamp: 'N/A'
  });

  useEffect(() => {
    if (role === 'admin' && activeTab === 'reports') {
      fetch('http://localhost:5000/health')
        .then((res) => res.json())
        .then((data) => setServerHealth(data))
        .catch(() => setServerHealth({ status: 'Offline / Port 5000 Unreachable', uptime: 0, timestamp: new Date().toISOString() }));
    }
  }, [role, activeTab]);

  // Event handler for Student toggling assignment submission (Express API sync)
  const handleToggleAssignment = (id) => {
    fetch(`http://localhost:5000/api/assignments/${id}/submit`, { method: 'PUT' })
      .then((res) => res.json())
      .then((updated) => {
        setAssignments((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, status: 'Submitted' } : item
          )
        );
      })
      .catch(() => {
        setAssignments((prev) =>
          prev.map((item) =>
            item.id === id
              ? {
                  ...item,
                  status: item.status.toLowerCase() === 'submitted' ? 'Pending' : 'Submitted'
                }
              : item
          )
        );
      });
  };

  // Event handler to mark attendance
  const handleMarkAttendance = (id) => {
    setAttendance((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              attended: item.attended + 1,
              total: item.total + 1
            }
          : item
      )
    );
  };

  // Faculty: Create Assignment (POST to Express API)
  const handleCreateAssignment = (e) => {
    e.preventDefault();
    if (!newAssignmentForm.title.trim()) return;

    fetch('http://localhost:5000/api/assignments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newAssignmentForm)
    })
      .then((res) => res.json())
      .then((created) => {
        const addedItem = {
          id: created.id || Date.now(),
          subject: created.subject || newAssignmentForm.subject,
          title: created.title || newAssignmentForm.title,
          status: 'Pending',
          dueDate: created.dueDate || newAssignmentForm.dueDate,
          meta: `Instructor: Faculty • Due: ${created.dueDate || newAssignmentForm.dueDate} • Max Marks: 25`,
          description: `Newly published assignment for ${created.subject || newAssignmentForm.subject}`
        };
        setAssignments((prev) => [...prev, addedItem]);
        setFacultyPostSuccess(`Successfully created: "${newAssignmentForm.title}"`);
        setNewAssignmentForm({ subject: 'CS3301 - Full Stack', title: '', dueDate: 'Oct 15, 2026' });
        setTimeout(() => setFacultyPostSuccess(''), 4000);
      })
      .catch(() => {
        const localItem = {
          id: assignments.length + 1,
          subject: newAssignmentForm.subject,
          title: newAssignmentForm.title,
          status: 'Pending',
          dueDate: newAssignmentForm.dueDate,
          meta: `Instructor: Faculty • Due: ${newAssignmentForm.dueDate} • Max Marks: 25`,
          description: `Assignment created locally for ${newAssignmentForm.subject}`
        };
        setAssignments((prev) => [...prev, localItem]);
        setFacultyPostSuccess(`Created locally: "${newAssignmentForm.title}"`);
        setNewAssignmentForm({ subject: 'CS3301 - Full Stack', title: '', dueDate: 'Oct 15, 2026' });
        setTimeout(() => setFacultyPostSuccess(''), 4000);
      });
  };

  // Faculty: Post Notice
  const handlePostNotice = (e) => {
    e.preventDefault();
    if (!newNoticeForm.title.trim()) return;

    const noticeObj = {
      id: `not-${Date.now()}`,
      title: newNoticeForm.title,
      dept: newNoticeForm.dept,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      meta: `${newNoticeForm.dept} • Just now`,
      badge: 'Faculty Notice',
      badgeType: 'new',
      description: newNoticeForm.description || 'Official communication posted by faculty member.',
      details: newNoticeForm.description || 'Additional academic instructions will be communicated in class.'
    };

    setNotices((prev) => [noticeObj, ...prev]);
    setNewNoticeForm({ title: '', dept: 'SOCSE Faculty', description: '' });
  };

  // Define tab navigation based on role
  const getTabsForRole = () => {
    switch (role) {
      case 'faculty':
        return [
          { id: 'notices', label: 'Post Notices & Events' },
          { id: 'assignments', label: 'Create Assignments' },
          { id: 'attendance', label: 'Mark Attendance' },
          { id: 'submissions', label: 'View Submissions' }
        ];
      case 'admin':
        return [
          { id: 'users', label: 'Manage Users' },
          { id: 'notices', label: 'Manage Notices & Events' },
          { id: 'reports', label: 'View System Reports' },
          { id: 'settings', label: 'System Settings' }
        ];
      case 'student':
      default:
        return [
          { id: 'notices', label: 'Notices & Events' },
          { id: 'assignments', label: 'Assignments' },
          { id: 'attendance', label: 'Track Attendance' },
          { id: 'profile', label: 'Profile' }
        ];
    }
  };

  const getRoleHeaderInfo = () => {
    switch (role) {
      case 'faculty':
        return {
          title: 'Faculty Portal',
          icon: '👨‍🏫',
          subtitle: 'Welcome, RVU Faculty Member'
        };
      case 'admin':
        return {
          title: 'Admin Portal',
          icon: '🛡️',
          subtitle: 'Welcome, RVU Administrator'
        };
      case 'student':
      default:
        return {
          title: 'Student Portal',
          icon: '👨‍🎓',
          subtitle: 'Welcome, RVU Student'
        };
    }
  };

  const headerInfo = getRoleHeaderInfo();
  const tabs = getTabsForRole();

  return (
    <section className="portal-container" id="active-portal-view">
      {/* 1. Header Banner */}
      <PortalHeader
        title={headerInfo.title}
        icon={headerInfo.icon}
        subtitle={headerInfo.subtitle}
        onBack={onBack}
      />

      {/* 2. Navigation Tabs */}
      <TabBar
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={(tabId) => setActiveTab(tabId)}
      />

      {/* 3. Tab Content View */}
      <div className="portal-body">

        {/* ======================================================== */}
        {/* STUDENT ROLE VIEWS                                       */}
        {/* ======================================================== */}
        {role === 'student' && activeTab === 'notices' && (
          <div>
            <h3 className="portal-section-heading">📢 Campus Notices & Events</h3>
            <div className="item-list">
              {notices.map((notice) => (
                <ItemCard
                  key={notice.id}
                  title={notice.title}
                  meta={notice.meta}
                  badge={notice.badge}
                  badgeType={notice.badgeType}
                  actionText="View Details"
                  onAction={() => setSelectedItem(notice)}
                />
              ))}
            </div>
          </div>
        )}

        {role === 'student' && activeTab === 'assignments' && (
          <div>
            <h3 className="portal-section-heading">📝 Enrolled Course Assignments</h3>
            <div className="item-list">
              {assignments.map((asg) => {
                const isSubmitted = (asg.status || '').toLowerCase() === 'submitted';
                return (
                  <ItemCard
                    key={asg.id}
                    title={asg.title}
                    meta={asg.meta || `${asg.subject} • Due: ${asg.dueDate}`}
                    badge={isSubmitted ? 'Submitted ✓' : 'Pending'}
                    badgeType={isSubmitted ? 'submitted' : 'pending'}
                  >
                    <div className="action-group" style={{ marginTop: '10px' }}>
                      <button
                        type="button"
                        className="btn-submit-action"
                        style={{
                          backgroundColor: isSubmitted ? '#28a745' : '#107c41'
                        }}
                        onClick={() => handleToggleAssignment(asg.id)}
                      >
                        {isSubmitted ? 'Submitted ✓' : 'Submit Assignment'}
                      </button>
                      <button
                        type="button"
                        className="btn-view-details"
                        onClick={() => setSelectedItem(asg)}
                      >
                        View Brief
                      </button>
                    </div>
                  </ItemCard>
                );
              })}
            </div>
          </div>
        )}

        {role === 'student' && activeTab === 'attendance' && (
          <div>
            <h3 className="portal-section-heading">📊 Course Attendance Tracker</h3>
            <div className="item-list">
              {attendance.map((att) => {
                const pct = Math.round((att.attended / att.total) * 100);
                const isGood = pct >= 85;
                return (
                  <ItemCard
                    key={att.id}
                    title={att.course}
                    meta={`Attended: ${att.attended} / ${att.total} Lectures (${pct}%)`}
                    badge={`${pct}%`}
                    badgeType={isGood ? 'new' : 'urgent'}
                    actionText="+ Check In"
                    actionBtnClass="btn-submit-action"
                    onAction={() => handleMarkAttendance(att.id)}
                  >
                    <div className="attendance-progress-bar-container">
                      <div
                        className="attendance-progress-bar"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: isGood ? '#107c41' : '#b91c1c'
                        }}
                      />
                    </div>
                  </ItemCard>
                );
              })}
            </div>
          </div>
        )}

        {role === 'student' && activeTab === 'profile' && (
          <div>
            <h3 className="portal-section-heading">👤 Student Academic Profile</h3>
            <div className="profile-card-grid">
              <div className="profile-stat-box">
                <span className="profile-stat-label">Full Name</span>
                <p className="profile-stat-value">Dhruvi Mittal</p>
              </div>
              <div className="profile-stat-box">
                <span className="profile-stat-label">University SRN</span>
                <p className="profile-stat-value">RVU24BEE001</p>
              </div>
              <div className="profile-stat-box">
                <span className="profile-stat-label">Program & School</span>
                <p className="profile-stat-value">B.Sc (Hons) Computer Science • SOCSE</p>
              </div>
              <div className="profile-stat-box">
                <span className="profile-stat-label">Semester</span>
                <p className="profile-stat-value">Semester V (Odd Sem 2026)</p>
              </div>
              <div className="profile-stat-box">
                <span className="profile-stat-label">Cumulative GPA</span>
                <p className="profile-stat-value">9.42 / 10.0</p>
              </div>
              <div className="profile-stat-box">
                <span className="profile-stat-label">Enrollment Status</span>
                <p className="profile-stat-value" style={{ color: '#107c41' }}>
                  {profileStatus}
                </p>
              </div>
            </div>
            <div style={{ marginTop: '20px' }}>
              <button
                type="button"
                className="btn-submit-action"
                onClick={() => {
                  const newStatus = prompt('Update Profile Bio / Status:', profileStatus);
                  if (newStatus) setProfileStatus(newStatus);
                }}
              >
                ✏️ Edit Student Status
              </button>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* FACULTY ROLE VIEWS                                       */}
        {/* ======================================================== */}
        {role === 'faculty' && activeTab === 'notices' && (
          <div>
            <h3 className="portal-section-heading">📢 Post Notices & Events (Faculty View)</h3>
            
            {/* Notice Creation Box */}
            <form onSubmit={handlePostNotice} style={styles.cardBox}>
              <h4 style={{ color: '#0A2240', marginBottom: '12px' }}>Publish New Department Notice</h4>
              <div style={styles.formRow}>
                <input
                  type="text"
                  placeholder="Notice Title (e.g. Guest Lecture on Cloud Architecture)"
                  value={newNoticeForm.title}
                  onChange={(e) => setNewNoticeForm({ ...newNoticeForm, title: e.target.value })}
                  style={styles.inputField}
                  required
                />
                <input
                  type="text"
                  placeholder="Department / Chapter"
                  value={newNoticeForm.dept}
                  onChange={(e) => setNewNoticeForm({ ...newNoticeForm, dept: e.target.value })}
                  style={styles.inputField}
                  required
                />
              </div>
              <textarea
                placeholder="Notice Details & Schedule..."
                value={newNoticeForm.description}
                onChange={(e) => setNewNoticeForm({ ...newNoticeForm, description: e.target.value })}
                style={{ ...styles.inputField, height: '70px', marginTop: '10px' }}
              />
              <button type="submit" style={styles.btnPrimary} className="btn-submit-action">
                📢 Broadcast Notice to Campus
              </button>
            </form>

            <div className="item-list" style={{ marginTop: '20px' }}>
              {notices.map((notice) => (
                <ItemCard
                  key={notice.id}
                  title={notice.title}
                  meta={notice.meta}
                  badge={notice.badge}
                  badgeType={notice.badgeType}
                  actionText="View Notice"
                  onAction={() => setSelectedItem(notice)}
                />
              ))}
            </div>
          </div>
        )}

        {role === 'faculty' && activeTab === 'assignments' && (
          <div>
            <h3 className="portal-section-heading">📝 Create & Manage Course Assignments</h3>
            
            {/* Create Assignment Form (Connects to POST /api/assignments) */}
            <form onSubmit={handleCreateAssignment} style={styles.cardBox}>
              <h4 style={{ color: '#0A2240', marginBottom: '12px' }}>
                Create New Assignment (Express API: <code>POST /api/assignments</code>)
              </h4>

              {facultyPostSuccess && (
                <div style={styles.successBanner}>
                  ✓ {facultyPostSuccess}
                </div>
              )}

              <div style={styles.formRow}>
                <select
                  value={newAssignmentForm.subject}
                  onChange={(e) => setNewAssignmentForm({ ...newAssignmentForm, subject: e.target.value })}
                  style={styles.inputField}
                >
                  <option value="CS3301 - Full Stack">CS3301 - Full Stack Development</option>
                  <option value="CS3302 - DBMS">CS3302 - Database Management Systems</option>
                  <option value="CS3303 - Algorithms">CS3303 - Design & Analysis of Algorithms</option>
                </select>

                <input
                  type="text"
                  placeholder="Assignment Title (e.g. Lab 4: MongoDB Schemas)"
                  value={newAssignmentForm.title}
                  onChange={(e) => setNewAssignmentForm({ ...newAssignmentForm, title: e.target.value })}
                  style={styles.inputField}
                  required
                />

                <input
                  type="text"
                  placeholder="Due Date (e.g. Oct 20, 2026)"
                  value={newAssignmentForm.dueDate}
                  onChange={(e) => setNewAssignmentForm({ ...newAssignmentForm, dueDate: e.target.value })}
                  style={styles.inputField}
                  required
                />
              </div>

              <button type="submit" style={styles.btnPrimary} className="btn-submit-action">
                ➕ Publish Assignment to Live API
              </button>
            </form>

            <h4 style={{ color: '#0A2240', marginTop: '24px', marginBottom: '10px' }}>Active Assignments List</h4>
            <div className="item-list">
              {assignments.map((asg) => (
                <ItemCard
                  key={asg.id}
                  title={asg.title}
                  meta={`Course: ${asg.subject} • Due: ${asg.dueDate}`}
                  badge={asg.status || 'Active'}
                  badgeType={(asg.status || '').toLowerCase() === 'submitted' ? 'submitted' : 'pending'}
                  actionText="View Brief"
                  onAction={() => setSelectedItem(asg)}
                />
              ))}
            </div>
          </div>
        )}

        {role === 'faculty' && activeTab === 'attendance' && (
          <div>
            <h3 className="portal-section-heading">📊 Mark & Update Class Attendance</h3>
            <div className="item-list">
              {attendance.map((att) => {
                const pct = Math.round((att.attended / att.total) * 100);
                return (
                  <ItemCard
                    key={att.id}
                    title={att.course}
                    meta={`Active Class Strength: ${att.attended} / ${att.total} Students Marked Present`}
                    badge={`${pct}% Present`}
                    badgeType="new"
                    actionText="➕ Mark Class Present"
                    actionBtnClass="btn-submit-action"
                    onAction={() => handleMarkAttendance(att.id)}
                  >
                    <div className="attendance-progress-bar-container">
                      <div
                        className="attendance-progress-bar"
                        style={{ width: `${pct}%`, backgroundColor: '#107c41' }}
                      />
                    </div>
                  </ItemCard>
                );
              })}
            </div>
          </div>
        )}

        {role === 'faculty' && activeTab === 'submissions' && (
          <div>
            <h3 className="portal-section-heading">📥 View Student Submissions</h3>
            <div style={styles.tableCard}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.trHead}>
                    <th style={styles.th}>Student Name</th>
                    <th style={styles.th}>Course</th>
                    <th style={styles.th}>Assignment</th>
                    <th style={styles.th}>Submitted On</th>
                    <th style={styles.th}>Grade / Status</th>
                    <th style={styles.th}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((sub) => (
                    <tr key={sub.id} style={styles.trBody}>
                      <td style={styles.td}><strong>{sub.student}</strong></td>
                      <td style={styles.td}>{sub.subject}</td>
                      <td style={styles.td}>{sub.assignment}</td>
                      <td style={styles.td}>{sub.submittedAt}</td>
                      <td style={styles.td}>
                        <span style={sub.grade === 'Pending' ? styles.badgePending : styles.badgeDone}>
                          {sub.grade}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <button
                          type="button"
                          style={styles.actionBtnSmall}
                          onClick={() => {
                            const newScore = prompt(`Enter Grade / Score for ${sub.student}:`, '20/20');
                            if (newScore) {
                              setSubmissions((prev) =>
                                prev.map((s) => s.id === sub.id ? { ...s, grade: newScore } : s)
                              );
                            }
                          }}
                        >
                          Grade
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* ADMIN ROLE VIEWS                                         */}
        {/* ======================================================== */}
        {role === 'admin' && activeTab === 'users' && (
          <div>
            <h3 className="portal-section-heading">👥 Manage University Portal Users</h3>
            <div style={styles.tableCard}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.trHead}>
                    <th style={styles.th}>User ID</th>
                    <th style={styles.th}>Full Name</th>
                    <th style={styles.th}>Email Address</th>
                    <th style={styles.th}>Assigned Role</th>
                    <th style={styles.th}>Department</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Administrative Action</th>
                  </tr>
                </thead>
                <tbody>
                  {usersList.map((u) => (
                    <tr key={u.id} style={styles.trBody}>
                      <td style={styles.td}>#USR-{1000 + u.id}</td>
                      <td style={styles.td}><strong>{u.name}</strong></td>
                      <td style={styles.td}>{u.email}</td>
                      <td style={styles.td}>
                        <span style={u.role === 'Admin' ? styles.badgeAdmin : u.role === 'Faculty' ? styles.badgeFaculty : styles.badgeStudent}>
                          {u.role}
                        </span>
                      </td>
                      <td style={styles.td}>{u.dept}</td>
                      <td style={styles.td}>
                        <span style={u.status === 'Active' ? styles.badgeActive : styles.badgeInactive}>
                          {u.status}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <button
                          type="button"
                          style={styles.actionBtnSmall}
                          onClick={() => {
                            setUsersList((prev) =>
                              prev.map((item) =>
                                item.id === u.id
                                  ? { ...item, status: item.status === 'Active' ? 'Inactive' : 'Active' }
                                  : item
                              )
                            );
                          }}
                        >
                          Toggle Status
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {role === 'admin' && activeTab === 'notices' && (
          <div>
            <h3 className="portal-section-heading">📢 Manage Notice Board & Announcements</h3>
            <div className="item-list">
              {notices.map((n) => (
                <ItemCard
                  key={n.id}
                  title={n.title}
                  meta={`${n.dept} • ${n.date}`}
                  badge={n.badge}
                  badgeType={n.badgeType}
                  actionText="Remove Notice"
                  actionBtnClass="btn-view-details"
                  onAction={() => {
                    if (confirm(`Remove notice: "${n.title}"?`)) {
                      setNotices((prev) => prev.filter((item) => item.id !== n.id));
                    }
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {role === 'admin' && activeTab === 'reports' && (
          <div>
            <h3 className="portal-section-heading">📈 System Diagnostics & Server Reports</h3>
            <div className="profile-card-grid">
              <div className="profile-stat-box">
                <span className="profile-stat-label">Express Backend API</span>
                <p className="profile-stat-value" style={{ color: '#107c41' }}>
                  {serverHealth.status || 'Active on :5000'}
                </p>
              </div>
              <div className="profile-stat-box">
                <span className="profile-stat-label">Server Uptime</span>
                <p className="profile-stat-value">
                  {typeof serverHealth.uptime === 'number' ? `${serverHealth.uptime.toFixed(1)}s` : 'Live'}
                </p>
              </div>
              <div className="profile-stat-box">
                <span className="profile-stat-label">Total Registered Users</span>
                <p className="profile-stat-value">{usersList.length} Accounts</p>
              </div>
              <div className="profile-stat-box">
                <span className="profile-stat-label">Assignments in Database</span>
                <p className="profile-stat-value">{assignments.length} Records</p>
              </div>
              <div className="profile-stat-box">
                <span className="profile-stat-label">Frontend Environment</span>
                <p className="profile-stat-value">Vite + React (Port 5173)</p>
              </div>
              <div className="profile-stat-box">
                <span className="profile-stat-label">CORS Whitelist Status</span>
                <p className="profile-stat-value" style={{ color: '#107c41' }}>
                  Enabled (Cross-Origin OK)
                </p>
              </div>
            </div>

            <div style={{ marginTop: '20px' }}>
              <button
                type="button"
                className="btn-submit-action"
                onClick={() => {
                  fetch('http://localhost:5000/health')
                    .then((r) => r.json())
                    .then((d) => setServerHealth(d))
                    .catch(() => alert('Server is currently offline. Run: cd server && npm run dev'));
                }}
              >
                🔄 Refresh Live Diagnostics
              </button>
            </div>
          </div>
        )}

        {role === 'admin' && activeTab === 'settings' && (
          <div>
            <h3 className="portal-section-heading">⚙️ Campus Connect System Settings</h3>
            <div style={styles.cardBox}>
              <h4 style={{ color: '#0A2240', marginBottom: '15px' }}>Environment & Infrastructure Configuration</h4>
              <ul style={{ listStyle: 'none', padding: 0, lineHeight: '2' }}>
                <li><strong>Backend Port:</strong> <code>5000</code> (Express REST Engine)</li>
                <li><strong>Frontend Host:</strong> <code>http://localhost:5173</code> (Vite React Client)</li>
                <li><strong>API Base Route:</strong> <code>/api/assignments</code></li>
                <li><strong>Database Engine:</strong> MongoDB + In-Memory Mock Store</li>
                <li><strong>Authentication Mode:</strong> Stateful Session & Stateless RBAC Tokens</li>
              </ul>
            </div>
          </div>
        )}

      </div>

      {/* 4. Modal Dialog for Item Details */}
      <DetailModal
        isOpen={Boolean(selectedItem)}
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </section>
  );
}

// Styling Object
const styles = {
  cardBox: {
    backgroundColor: '#f8fafc',
    padding: '20px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    marginBottom: '20px'
  },
  formRow: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
    marginBottom: '10px'
  },
  inputField: {
    flex: '1',
    minWidth: '200px',
    padding: '10px 14px',
    borderRadius: '6px',
    border: '1px solid #cbd5e1',
    fontSize: '14px',
    outline: 'none'
  },
  btnPrimary: {
    backgroundColor: '#0A2240',
    color: '#F2A900',
    fontWeight: 'bold',
    padding: '10px 20px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    marginTop: '10px'
  },
  successBanner: {
    backgroundColor: '#dcfce7',
    color: '#15803d',
    padding: '10px 14px',
    borderRadius: '6px',
    marginBottom: '12px',
    fontWeight: 'bold'
  },
  tableCard: {
    overflowX: 'auto',
    backgroundColor: '#fff',
    borderRadius: '8px',
    border: '1px solid #e2e8f0'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
    fontSize: '14px'
  },
  trHead: {
    backgroundColor: '#0A2240',
    color: '#fff'
  },
  th: {
    padding: '12px 14px',
    fontWeight: '600'
  },
  trBody: {
    borderBottom: '1px solid #e2e8f0'
  },
  td: {
    padding: '12px 14px'
  },
  badgePending: {
    backgroundColor: '#fef3c7',
    color: '#92400e',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '600'
  },
  badgeDone: {
    backgroundColor: '#dcfce7',
    color: '#15803d',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '600'
  },
  badgeActive: {
    backgroundColor: '#dcfce7',
    color: '#15803d',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '600'
  },
  badgeInactive: {
    backgroundColor: '#fee2e2',
    color: '#b91c1c',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '600'
  },
  badgeStudent: {
    backgroundColor: '#e0f2fe',
    color: '#0369a1',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '600'
  },
  badgeFaculty: {
    backgroundColor: '#fef3c7',
    color: '#b45309',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '600'
  },
  badgeAdmin: {
    backgroundColor: '#f3e8ff',
    color: '#6b21a8',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '600'
  },
  actionBtnSmall: {
    backgroundColor: '#0A2240',
    color: '#fff',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px'
  }
};
