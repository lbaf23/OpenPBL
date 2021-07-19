package controllers

import (
	"fmt"
	"github.com/astaxie/beego"
	"openpbl-go/models"
	"strconv"
	"strings"
)

// ProjectController
// Operations about Projects
type ProjectController struct {
	beego.Controller
}

// GetProjectForStudent
// @Title
// @Description
// @Param id path string true "project id"
// @Success 200 {object} models.TeacherProject
// @Failure 403 :id is empty
// @router /student/:id [get]
func (p *ProjectController) GetProjectForStudent() {
	pid := p.GetString(":id")
	if pid != "" {
		project, err := models.GetProjectByPidForStudent(pid)
		if err != nil {
			p.Data["json"] = map[string]string{"error": err.Error()}
		}
		p.Data["json"] = map[string]models.ProjectDetail{"project": project}
	}
	p.ServeJSON()
}
// GetProjectForTeacher
// @Title
// @Description
// @Param id path string true ""
// @Success 200 {object} models.TeacherProject
// @Failure 403 :id is empty
// @router /teacher/:id [get]
func (p *ProjectController) GetProjectForTeacher() {
	pid := p.GetString(":id")
	if pid != "" {
		project, err := models.GetProjectByPidForTeacher(pid)
		if err != nil {
			p.Data["json"] = map[string]string{"error": err.Error()}
		}
		p.Data["json"] = map[string]models.ProjectDetail{"project": project}
	}
	p.ServeJSON()
}


// CreateProject
// @Title
// @Description create project
// @Param body body models.Project true	""
// @Success 200 {int} models.Project.Id
// @Failure 403 body is empty
// @router / [post]
func (p *ProjectController) CreateProject() {
	tid, err := strconv.ParseInt(p.GetString("teacherId"), 10, 64)
	if err != nil {
		p.Data["json"] = map[string]string{"error": err.Error()}
	}
	project := &models.Project{
		TeacherId:        tid,
	}
	if err != nil {
		p.Data["json"] = map[string]string{"error": err.Error()}
	}
	err = project.Create()
	if err != nil {
		p.Data["json"] = map[string]string{"error": err.Error()}
	}
	p.Data["json"] = map[string]string{"id": strconv.FormatInt(project.Id, 10)}
	p.ServeJSON()
}

// UpdateProject
// @Title
// @Description create project
// @Param body body models.Project true	""
// @Success 200 {int} models.Project.Id
// @Failure 403 body is empty
// @router /info [post]
func (p *ProjectController) UpdateProject() {
	pid, err := p.GetInt64("id")
	tid, err := p.GetInt64("teacherId")
	if err != nil {
		p.Data["json"] = map[string]string{"error": err.Error()}
	}
	project := &models.Project{
		Id:               pid,
		Image:            p.GetString("image"),
		ProjectTitle:     p.GetString("projectTitle"),
		ProjectIntroduce: p.GetString("projectIntroduce"),
		ProjectGoal:      p.GetString("projectGoal"),
		TeacherId:        tid,
		Subjects:         p.GetString("subjects"),
		Skills:           p.GetString("skills"),
	}
	if err != nil {
		p.Data["json"] = map[string]string{"error": err.Error()}
	}
	projectSubjects, projectSkills, err := getProjectSubjectsAndSkills(pid, project.Subjects, project.Skills)

	err = project.Update(projectSubjects, projectSkills)
	if err != nil {
		p.Data["json"] = map[string]string{"error": err.Error()}
	}
	p.Data["json"] = map[string]bool{"result": true}
	p.ServeJSON()
}

// GetProjectOutline
// @Title
// @Description
// @Param pid path string true "project id"
// @Success 200 {object} []models.Outline
// @Failure 403 body is empty
// @router /outline/:pid [get]
func (p *ProjectController) GetProjectOutline() {
	pid := p.GetString(":pid")
	if pid != "" {
		outline, err := models.GetOutlineByPid(pid)
		if err != nil {
			p.Data["json"] = map[string]string{"error": err.Error()}
		}
		p.Data["json"] = map[string][]models.Outline{"outline": outline}
	}
	p.ServeJSON()
}


// GetProjectChapters
// @Title
// @Description
// @Param pid path string true "project id"
// @Success 200 {object} []models.Chapter
// @Failure 403 body is empty
// @router /chapters/:pid [get]
func (p *ProjectController) GetProjectChapters() {
	pid := p.GetString(":pid")
	if pid != "" {
		chapters, err := models.GetChaptersByPid(pid)
		if err != nil {
			p.Data["json"] = map[string]string{"error": err.Error()}
		}
		p.Data["json"] = map[string][]models.Chapter{"chapters": chapters}
	}
	p.ServeJSON()
}
// CreateProjectChapter
// @Title
// @Description
// @Param body body models.Chapter true ""
// @Success 200 {object}
// @Failure 403 body is empty
// @router /chapter [post]
func (p *ProjectController) CreateProjectChapter() {
	pid, err := p.GetInt64("projectId")
	num, err := p.GetInt("chapterNumber")
	chapter := &models.Chapter{
		ProjectId:        pid,
		ChapterName:      p.GetString("chapterName"),
		ChapterNumber:    num,
	}

	fmt.Println(chapter)

	if err != nil {
		p.Data["json"] = map[string]string{"error": err.Error()}
	}
	err = chapter.Create()
	if err != nil {
		p.Data["json"] = map[string]string{"error": err.Error()}
	}
	p.Data["json"] = map[string]string{"id": strconv.FormatInt(chapter.Id, 10)}
	p.ServeJSON()
}

// GetChapterSections
// @Title
// @Description
// @Param cid path string true "chapter id"
// @Success 200 {object} []models.Section
// @Failure 403 body is empty
// @router /chapter/sections/:cid [get]
func (p *ProjectController) GetChapterSections() {
	cid := p.GetString(":cid")
	if cid != "" {
		sections, err := models.GetSectionsByCid(cid)
		if err != nil {
			p.Data["json"] = map[string]string{"error": err.Error()}
		}
		p.Data["json"] = map[string][]models.Section{"sections": sections}
	}
	p.ServeJSON()
}
// CreateChapterSection
// @Title
// @Description
// @Param body body models.Section true ""
// @Success 200 {object}
// @Failure 403 body is empty
// @router /chapter/section [post]
func (p *ProjectController) CreateChapterSection() {
	cid, err := p.GetInt64("chapterId")
	num, err := p.GetInt("sectionNumber")
	section := &models.Section{
		ChapterId:        cid,
		SectionName:      p.GetString("sectionName"),
		SectionNumber:    num,
	}
	if err != nil {
		p.Data["json"] = map[string]string{"error": err.Error()}
	}
	err = section.Create()
	if err != nil {
		p.Data["json"] = map[string]string{"error": err.Error()}
	}
	p.Data["json"] = map[string]string{"id": strconv.FormatInt(section.Id, 10)}
	p.ServeJSON()
}

// GetSubmitFiles
// @Title
// @Description
// @Param pid path string true ""
// @Param sid path string true ""
// @Success 200 {object} []models.SubmitFile
// @Failure 403 body is empty
// @router /submit-files/:pid/:sid [get]
func (p *ProjectController) GetSubmitFiles() {
	sid := p.GetString(":sid")
	pid := p.GetString(":pid")
	if sid != "" && pid != "" {
		files, err := models.GetSubmitFiles(sid, pid)
		if err != nil {
			p.Data["json"] = map[string]string{"error": err.Error()}
		}
		p.Data["json"] = map[string][]models.SubmitFile{"files": files}
	}
	p.ServeJSON()
}

// CreateSubmitFile
// @Title
// @Description
// @Param body body models.SubmitFile true ""
// @Success 200 {object}
// @Failure 403 body is empty
// @router /submit-files [post]
func (p *ProjectController) CreateSubmitFile() {
	pid, err := p.GetInt64("projectId")
	sid, err := p.GetInt64("studentId")
	f := &models.SubmitFile{
		ProjectId:       pid,
		StudentId:       sid,
		SubmitIntroduce: p.GetString("submitIntroduce"),
		FilePath:        p.GetString("filePath"),
		FileName:        p.GetString("fileName"),
	}
	err = f.Create()
	if err != nil {
		p.Data["json"] = map[string]string{"error": err.Error()}
	}
	p.Data["json"] = map[string]string{"id": strconv.FormatInt(f.Id, 10)}
	p.ServeJSON()
}

// GetSection
// @Title
// @Description
// @Param body body models.File true ""
// @Success 200 {object}
// @Failure 403 body is empty
// @router /chapter/section/:sid [get]
func (p *ProjectController) GetSection() {
	sid := p.GetString(":sid")
	if sid != "" {
		section, err := models.GetSectionById(sid)
		if err != nil {
			p.Data["json"] = map[string]string{"error": err.Error()}
		}
		p.Data["json"] = map[string]models.Section{"section": section}
	}
	p.ServeJSON()
}

type StudentList struct {
	Count    int64                `json:"count"`
	Students []models.StudentInfo `json:"students"`
}

// GetProjectStudents
// @Title
// @Description
// @Param from query int true ""
// @Param size query int true ""
// @Success 200 {object} []models.StudentInfo
// @Failure 403 body is empty
// @router /students/:pid [get]
func (p *ProjectController) GetProjectStudents() {
	pid := p.GetString(":pid")
	from, err := p.GetInt("from")
	if err != nil {
		from = 0
	}
	size, err := p.GetInt("size")
	if err != nil {
		size = 10
	}
	if pid != "" {
		students, err := models.GetProjectStudents(pid, from, size)
		rows, err := models.CountProjectStudents(pid, from, size)
		if err != nil {
			p.Data["json"] = map[string]string{"error": err.Error()}
		}
		p.Data["json"] = StudentList{
			Count: rows,
			Students: students,
		}
	}
	p.ServeJSON()
}

func getProjectSubjectsAndSkills(pid int64, subjects string, skills string) (subjectList []*models.ProjectSubject, skillList []*models.ProjectSkill, err error) {
	var (
		subjectL []string
		skillL   []string
	)

	if subjects == "" {
		subjectL = make([]string, 0)
	} else {
		subjectL = strings.Split(subjects, ",")
	}
	if skills == "" {
		skillL = make([]string, 0)
	} else {
		skillL = strings.Split(skills, ",")
	}
	n1 := len(subjectL)
	n2 := len(skillL)

	subjectList = make([]*models.ProjectSubject, n1)
	skillList = make([]*models.ProjectSkill, n2)
	for i:=0; i<n1; i++ {
		subjectList[i] = &models.ProjectSubject{
			Subject:   subjectL[i],
			ProjectId: pid,
		}
	}
	for i:=0; i<n2; i++ {
		skillList[i] = &models.ProjectSkill{
			Skill:     skillL[i],
			ProjectId: pid,
		}
	}
	return
}