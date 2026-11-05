// Campus Connect Portal - StudentManager Component (Experiment 7)
// Demonstrates Full Stack MongoDB CRUD Integration with React 19 + Express 4 + Mongoose

import { useState, useEffect, useCallback } from 'react';
import {
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent
} from '../services/studentService.js';

// Helper for Grade Badge Calculation
const getGradeInfo = (rawMarks) => {
  const marks = Number(rawMarks);
  if (marks >= 85) {
    return {
      gradeLabel: 'Distinction (A+)',
      gradeColor: '#15803d',
      gradeBg: '#dcfce7'
    };
  }
  if (marks >= 70) {
    return {
      gradeLabel: 'First Class (A)',
      gradeColor: '#0d5c3a',
      gradeBg: '#ecfdf5'
    };
  }
  if (marks >= 50) {
    return {
      gradeLabel: 'Second Class (B)',
      gradeColor: '#b45309',
      gradeBg: '#fef3c7'
    };
  }
  return {
    gradeLabel: 'Remedial (F)',
    gradeColor: '#b91c1c',
    gradeBg: '#fee2e2'
  };
};

export default function StudentManager() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    usn: '',
    department: '',
    marks: ''
  });

  // Track if we are editing an existing record (stores student _id)
  const [editingId, setEditingId] = useState(null);

  const fetchStudentRecords = useCallback(async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const response = await getStudents();
      if (response && response.data) {
        setStudents(response.data);
      }
    } catch (err) {
      setErrorMessage(`Failed to fetch student records: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch all students on component mount
  useEffect(() => {
    fetchStudentRecords();
  }, [fetchStudentRecords]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setErrorMessage('Validation Error: Student Name is required.');
      return false;
    }
    if (!formData.usn.trim()) {
      setErrorMessage('Validation Error: Student USN is required.');
      return false;
    }
    if (!formData.department.trim()) {
      setErrorMessage('Validation Error: Department is required.');
      return false;
    }
    if (formData.marks === '' || formData.marks === null || formData.marks === undefined) {
      setErrorMessage('Validation Error: Marks are required.');
      return false;
    }
    const marksNum = Number(formData.marks);
    if (isNaN(marksNum) || marksNum < 0 || marksNum > 100) {
      setErrorMessage('Validation Error: Marks must be a valid number between 0 and 100.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!validateForm()) {
      return;
    }

    const payload = {
      name: formData.name.trim(),
      usn: formData.usn.trim().toUpperCase(),
      department: formData.department.trim(),
      marks: Number(formData.marks)
    };

    setActionLoading(true);
    try {
      if (editingId) {
        // PUT - Update student
        const result = await updateStudent(editingId, payload);
        setSuccessMessage(result.message || 'Student record updated successfully in MongoDB!');
        setEditingId(null);
      } else {
        // POST - Create student
        const result = await createStudent(payload);
        setSuccessMessage(result.message || 'Student record created successfully in MongoDB!');
      }

      // Reset form
      setFormData({
        name: '',
        usn: '',
        department: '',
        marks: ''
      });

      // Refresh list
      await fetchStudentRecords();
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditClick = (student) => {
    setEditingId(student._id);
    setFormData({
      name: student.name,
      usn: student.usn,
      department: student.department,
      marks: student.marks
    });
    setErrorMessage('');
    setSuccessMessage(`Editing record for ${student.name} (${student.usn}). Update fields and click Save Changes.`);

    // Scroll smoothly to form
    const formElem = document.getElementById('student-crud-form');
    if (formElem) {
      formElem.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
      name: '',
      usn: '',
      department: '',
      marks: ''
    });
    setErrorMessage('');
    setSuccessMessage('Edit operation cancelled.');
  };

  const handleDeleteClick = async (student) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to permanently delete student "${student.name}" (USN: ${student.usn}) from MongoDB?`
    );

    if (!confirmDelete) return;

    setActionLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const result = await deleteStudent(student._id);
      setSuccessMessage(result.message || `Student ${student.name} deleted successfully!`);
      // If we were editing the deleted record, cancel edit mode
      if (editingId === student._id) {
        handleCancelEdit();
      }
      await fetchStudentRecords();
    } catch (err) {
      setErrorMessage(`Delete Failed: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="student-manager-root">
      {/* 1. Header Banner & Database Diagnostics */}
      <div style={styles.bannerContainer}>
        <div>
          <h3 style={styles.bannerTitle}>
            🎓 MongoDB Student Management Suite
          </h3>
          <p style={styles.bannerSubtitle}>
            Full-Stack RESTful CRUD integration backed by MongoDB collection <code>campus_connect.students</code>
          </p>
        </div>
        <div style={styles.statsBadge}>
          <span style={styles.dotOnline} />
          <strong>MongoDB Live</strong>: {students.length} Records Enrolled
        </div>
      </div>

      {/* 2. Notification Feedback Banners */}
      {errorMessage && (
        <div style={styles.errorBanner} role="alert" id="student-error-alert">
          <span style={{ fontSize: '1.2rem', marginRight: '8px' }}>⚠️</span>
          <span>{errorMessage}</span>
          <button
            type="button"
            onClick={() => setErrorMessage('')}
            style={styles.closeAlertBtn}
          >
            ×
          </button>
        </div>
      )}

      {successMessage && (
        <div style={styles.successBanner} role="alert" id="student-success-alert">
          <span style={{ fontSize: '1.2rem', marginRight: '8px' }}>✅</span>
          <span>{successMessage}</span>
          <button
            type="button"
            onClick={() => setSuccessMessage('')}
            style={styles.closeAlertBtn}
          >
            ×
          </button>
        </div>
      )}

      {/* 3. Add / Edit Student Form */}
      <div style={styles.card} id="student-crud-form">
        <div style={styles.cardHeader}>
          <h4 style={styles.cardTitle}>
            {editingId ? '✏️ Update Student Record' : '➕ Add New Student Record'}
          </h4>
          {editingId && (
            <span style={styles.editingTag}>Editing ID: {editingId}</span>
          )}
        </div>

        <form onSubmit={handleSubmit} style={styles.formGrid}>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="student-name">
              Student Full Name <span style={styles.requiredAsterisk}>*</span>
            </label>
            <input
              id="student-name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g. Rahul Sharma"
              style={styles.input}
              disabled={actionLoading}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="student-usn">
              University USN <span style={styles.requiredAsterisk}>*</span>
            </label>
            <input
              id="student-usn"
              type="text"
              name="usn"
              value={formData.usn}
              onChange={handleInputChange}
              placeholder="e.g. BSC001"
              style={styles.input}
              disabled={actionLoading}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="student-dept">
              Department / Major <span style={styles.requiredAsterisk}>*</span>
            </label>
            <input
              id="student-dept"
              type="text"
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              placeholder="e.g. Computer Science"
              style={styles.input}
              disabled={actionLoading}
              list="dept-options"
            />
            <datalist id="dept-options">
              <option value="Computer Science" />
              <option value="Cloud Computing" />
              <option value="AI & Data Science" />
              <option value="Cyber Security" />
              <option value="Electronics & Communication" />
            </datalist>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="student-marks">
              Academic Marks (0 - 100) <span style={styles.requiredAsterisk}>*</span>
            </label>
            <input
              id="student-marks"
              type="number"
              name="marks"
              min="0"
              max="100"
              value={formData.marks}
              onChange={handleInputChange}
              placeholder="e.g. 85"
              style={styles.input}
              disabled={actionLoading}
            />
          </div>

          <div style={styles.formActions}>
            <button
              type="submit"
              id="btn-save-student"
              style={editingId ? styles.btnUpdate : styles.btnSubmit}
              disabled={actionLoading}
            >
              {actionLoading
                ? 'Processing...'
                : editingId
                ? '💾 Save Changes (PUT)'
                : '➕ Add Student (POST)'}
            </button>

            {editingId && (
              <button
                type="button"
                id="btn-cancel-edit"
                onClick={handleCancelEdit}
                style={styles.btnCancel}
                disabled={actionLoading}
              >
                ✕ Cancel Edit
              </button>
            )}

            <button
              type="button"
              onClick={fetchStudentRecords}
              style={styles.btnRefresh}
              disabled={loading || actionLoading}
              title="Refresh records from MongoDB"
            >
              🔄 Refresh List
            </button>
          </div>
        </form>
      </div>

      {/* 4. Student Records Table */}
      <div style={styles.card}>
        <div style={styles.cardHeaderFlex}>
          <div>
            <h4 style={styles.cardTitle}>📋 Enrolled Student Records</h4>
            <span style={styles.subText}>
              Real-time synchronization with MongoDB document repository
            </span>
          </div>
          <span style={styles.countBadge}>
            Total: {students.length} student{students.length === 1 ? '' : 's'}
          </span>
        </div>

        {loading ? (
          <div style={styles.loadingBox} id="loading-indicator">
            <div style={styles.spinner} />
            <p style={{ marginTop: '12px', color: '#475569', fontWeight: 500 }}>
              Connecting to MongoDB and loading student documents...
            </p>
          </div>
        ) : students.length === 0 ? (
          <div style={styles.emptyBox} id="empty-state">
            <span style={{ fontSize: '2.5rem' }}>📭</span>
            <h5 style={{ margin: '10px 0 6px 0', color: '#1e293b', fontSize: '1.1rem' }}>
              No Student Documents Found
            </h5>
            <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>
              MongoDB collection <code>students</code> is currently empty. Use the form above to add a student.
            </p>
          </div>
        ) : (
          <div style={styles.tableResponsive}>
            <table style={styles.table} id="student-records-table">
              <thead>
                <tr style={styles.tableHeadRow}>
                  <th style={styles.th}>#</th>
                  <th style={styles.th}>Student Name</th>
                  <th style={styles.th}>USN</th>
                  <th style={styles.th}>Department</th>
                  <th style={styles.th}>Marks</th>
                  <th style={styles.th}>Grade / Performance</th>
                  <th style={styles.thCenter}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, index) => {
                  const { gradeLabel, gradeColor, gradeBg } = getGradeInfo(student.marks);
                  const isCurrentEditing = editingId === student._id;

                  return (
                    <tr
                      key={student._id}
                      style={{
                        ...styles.tableRow,
                        backgroundColor: isCurrentEditing ? '#f0fdf4' : index % 2 === 0 ? '#ffffff' : '#f8fafc'
                      }}
                      className="student-table-row"
                    >
                      <td style={styles.tdIndex}>{index + 1}</td>
                      <td style={styles.tdBold}>
                        {student.name}
                        {isCurrentEditing && (
                          <span style={styles.editingPill}>Editing</span>
                        )}
                      </td>
                      <td style={styles.td}>
                        <code style={styles.usnCode}>{student.usn}</code>
                      </td>
                      <td style={styles.td}>{student.department}</td>
                      <td style={styles.tdMarks}>
                        <strong>{student.marks}</strong> / 100
                      </td>
                      <td style={styles.td}>
                        <span
                          style={{
                            ...styles.gradeBadge,
                            color: gradeColor,
                            backgroundColor: gradeBg,
                            borderColor: gradeColor
                          }}
                        >
                          {gradeLabel}
                        </span>
                      </td>
                      <td style={styles.tdActions}>
                        <button
                          type="button"
                          onClick={() => handleEditClick(student)}
                          style={styles.btnEditAction}
                          title="Edit this student record"
                          className="btn-edit-student"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteClick(student)}
                          style={styles.btnDeleteAction}
                          title="Delete this student record"
                          className="btn-delete-student"
                        >
                          🗑️ Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// Scoped component inline CSS styles ensuring responsive and consistent styling
const styles = {
  bannerContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '12px',
    marginBottom: '20px',
    paddingBottom: '14px',
    borderBottom: '2px solid #e2e8f0'
  },
  bannerTitle: {
    margin: 0,
    fontSize: '1.3rem',
    color: '#0d5c3a',
    fontWeight: 700
  },
  bannerSubtitle: {
    margin: '4px 0 0 0',
    fontSize: '0.88rem',
    color: '#64748b'
  },
  statsBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 14px',
    backgroundColor: '#ecfdf5',
    color: '#065f46',
    border: '1px solid #a7f3d0',
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontWeight: 600
  },
  dotOnline: {
    width: '10px',
    height: '10px',
    backgroundColor: '#10b981',
    borderRadius: '50%',
    display: 'inline-block',
    boxShadow: '0 0 0 2px rgba(16, 185, 129, 0.3)'
  },
  errorBanner: {
    backgroundColor: '#fef2f2',
    color: '#991b1b',
    border: '1px solid #fecaca',
    borderRadius: '8px',
    padding: '12px 16px',
    marginBottom: '18px',
    display: 'flex',
    alignItems: 'center',
    fontSize: '0.92rem',
    boxShadow: '0 2px 4px rgba(0,0,0,0.04)'
  },
  successBanner: {
    backgroundColor: '#f0fdf4',
    color: '#166534',
    border: '1px solid #bbf7d0',
    borderRadius: '8px',
    padding: '12px 16px',
    marginBottom: '18px',
    display: 'flex',
    alignItems: 'center',
    fontSize: '0.92rem',
    boxShadow: '0 2px 4px rgba(0,0,0,0.04)'
  },
  closeAlertBtn: {
    marginLeft: 'auto',
    background: 'none',
    border: 'none',
    fontSize: '1.25rem',
    cursor: 'pointer',
    color: 'inherit',
    lineHeight: 1
  },
  card: {
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '10px',
    padding: '22px',
    marginBottom: '24px',
    boxShadow: '0 3px 10px rgba(0,0,0,0.03)'
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
    borderBottom: '1px solid #f1f5f9',
    paddingBottom: '10px'
  },
  cardHeaderFlex: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '10px',
    marginBottom: '16px',
    borderBottom: '1px solid #f1f5f9',
    paddingBottom: '10px'
  },
  cardTitle: {
    margin: 0,
    fontSize: '1.12rem',
    color: '#1e293b',
    fontWeight: 700
  },
  subText: {
    fontSize: '0.82rem',
    color: '#64748b'
  },
  editingTag: {
    fontSize: '0.78rem',
    color: '#b45309',
    backgroundColor: '#fef3c7',
    padding: '4px 10px',
    borderRadius: '4px',
    fontWeight: 600
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '16px'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column'
  },
  label: {
    fontSize: '0.86rem',
    fontWeight: 600,
    color: '#334155',
    marginBottom: '6px'
  },
  requiredAsterisk: {
    color: '#dc2626'
  },
  input: {
    padding: '9px 12px',
    fontSize: '0.92rem',
    border: '1px solid #cbd5e1',
    borderRadius: '6px',
    outline: 'none',
    transition: 'border-color 0.2s',
    backgroundColor: '#ffffff',
    color: '#0f172a'
  },
  formActions: {
    gridColumn: '1 / -1',
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '12px',
    marginTop: '6px',
    paddingTop: '12px',
    borderTop: '1px dashed #e2e8f0'
  },
  btnSubmit: {
    padding: '10px 20px',
    backgroundColor: '#0d5c3a',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '0.92rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background 0.2s, transform 0.1s'
  },
  btnUpdate: {
    padding: '10px 20px',
    backgroundColor: '#d97706',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '0.92rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background 0.2s, transform 0.1s'
  },
  btnCancel: {
    padding: '10px 16px',
    backgroundColor: '#64748b',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '0.92rem',
    fontWeight: 600,
    cursor: 'pointer'
  },
  btnRefresh: {
    padding: '10px 16px',
    backgroundColor: '#f1f5f9',
    color: '#334155',
    border: '1px solid #cbd5e1',
    borderRadius: '6px',
    fontSize: '0.92rem',
    fontWeight: 600,
    cursor: 'pointer',
    marginLeft: 'auto'
  },
  countBadge: {
    backgroundColor: '#f1f5f9',
    color: '#0f172a',
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '0.82rem',
    fontWeight: 600,
    border: '1px solid #e2e8f0'
  },
  tableResponsive: {
    overflowX: 'auto',
    width: '100%'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left'
  },
  tableHeadRow: {
    backgroundColor: '#f8fafc',
    borderBottom: '2px solid #e2e8f0'
  },
  th: {
    padding: '12px 14px',
    fontSize: '0.85rem',
    fontWeight: 700,
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  thCenter: {
    padding: '12px 14px',
    fontSize: '0.85rem',
    fontWeight: 700,
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    textAlign: 'center'
  },
  tableRow: {
    borderBottom: '1px solid #f1f5f9',
    transition: 'background 0.15s'
  },
  tdIndex: {
    padding: '12px 14px',
    fontSize: '0.88rem',
    color: '#64748b',
    fontWeight: 600
  },
  tdBold: {
    padding: '12px 14px',
    fontSize: '0.92rem',
    color: '#0f172a',
    fontWeight: 600
  },
  td: {
    padding: '12px 14px',
    fontSize: '0.88rem',
    color: '#334155'
  },
  tdMarks: {
    padding: '12px 14px',
    fontSize: '0.92rem',
    color: '#0f172a'
  },
  usnCode: {
    backgroundColor: '#f1f5f9',
    padding: '2px 6px',
    borderRadius: '4px',
    color: '#0d5c3a',
    fontWeight: 600,
    fontFamily: 'monospace'
  },
  gradeBadge: {
    display: 'inline-block',
    padding: '3px 9px',
    borderRadius: '12px',
    fontSize: '0.78rem',
    fontWeight: 600,
    border: '1px solid'
  },
  tdActions: {
    padding: '12px 14px',
    textAlign: 'center',
    whiteSpace: 'nowrap'
  },
  btnEditAction: {
    padding: '6px 12px',
    backgroundColor: '#f0fdf4',
    color: '#15803d',
    border: '1px solid #86efac',
    borderRadius: '4px',
    fontSize: '0.82rem',
    fontWeight: 600,
    cursor: 'pointer',
    marginRight: '6px',
    transition: 'background 0.15s'
  },
  btnDeleteAction: {
    padding: '6px 12px',
    backgroundColor: '#fef2f2',
    color: '#b91c1c',
    border: '1px solid #fca5a5',
    borderRadius: '4px',
    fontSize: '0.82rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background 0.15s'
  },
  editingPill: {
    marginLeft: '8px',
    padding: '2px 6px',
    backgroundColor: '#dbeafe',
    color: '#1d4ed8',
    borderRadius: '4px',
    fontSize: '0.72rem',
    fontWeight: 600
  },
  loadingBox: {
    padding: '36px',
    textAlign: 'center'
  },
  spinner: {
    width: '32px',
    height: '32px',
    border: '4px solid #e2e8f0',
    borderTop: '4px solid #0d5c3a',
    borderRadius: '50%',
    margin: '0 auto',
    animation: 'spin 0.8s linear infinite'
  },
  emptyBox: {
    padding: '40px 20px',
    textAlign: 'center',
    backgroundColor: '#fafafa',
    borderRadius: '8px',
    border: '1px dashed #cbd5e1'
  }
};
