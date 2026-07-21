export const calculateProfileCompletion = (student) => {
    const fields = [
        student.prn,
        student.rollNumber,
        student.branch,
        student.year,
        student.cgpa,
        student.phone,
        student.address,
        student.linkedin,
        student.github,
        student.portfolio,
        student.resume?.url,
        student.profilePicture?.url,
        student.skills?.length > 0
    ];

    const completed = fields.filter(Boolean).length;
    const percentage = Math.round((completed / fields.length) * 100);

    return percentage;
};