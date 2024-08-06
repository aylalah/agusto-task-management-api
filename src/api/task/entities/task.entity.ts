import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    ManyToMany,
    JoinTable,
    PrimaryGeneratedColumn,
    Unique,
    UpdateDateColumn,
  } from 'typeorm';
  
  @Entity({
    name: 'tasks',
    orderBy: {
        task: 'ASC',
    },
  })
  
  @Unique(['id'])
  export class Task {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column('varchar', { name: 'project', nullable: true, length: 100 })
    project?: string;
  
    @Column('varchar', { name: 'task', nullable: true, length: 100 })
    task?: string;

    @Column('enum', { name: 'category', nullable: true, default: '', enum: ['', 'Design', 'Development', 'QA', 'Product'] })
    category?: string;
  
    @Column('varchar', { name: 'description', nullable: true, length: 200 })
    description?: string;

    @Column('varchar', { name: 'comment', nullable: true, length: 200 })
    comment?: string;

    @Column('json', { name: 'assigned_to', nullable: true, default: null })
    assigned_to?: any;

    @Column('enum', { name: 'priority', nullable: true, default: 'High', enum: ['V.High', 'High', 'Medium', 'Low'] })
    priority?: string;

    @Column('enum', { name: 'progress', nullable: true, default: 0, enum: [ 0, 15, 30, 50, 80, 95, 100]})
    progress?: number;

    // @Column('json', { name: 'checklist', nullable: true, default: null })
    // checklist?: any;

    // @Column('int', { name: 'total_checklist', nullable: true, default: 0 })
    // total_checklist?: number;

    // @Column('int', { name: 'total_checked', nullable: true, default: 0 })
    // total_checked?: number;

    @Column('varchar', { name: 'attachment', nullable: true, length: 200 })
    attachment?: string;

    @Column('boolean', { name: 'is_done', nullable: true, default: false })
    is_done?: boolean;
  
    @Column('enum', { name: 'status', nullable: true, default: 'open', enum: ['open', 'pending', 'inprogress', 'completed', 'backlog', 'canceled'] })
    status?: string;
  
    @Column('varchar', { name: 'created_by', nullable: true, length: 50 })
    created_by?: string;
  
    @CreateDateColumn({ name: 'created_at' })
    created_at?: string;

    @CreateDateColumn({ name: 'start_date' })
    start_date?: string;

    @CreateDateColumn({ name: 'due_date' })
    due_date?: string;
  
    @Column('varchar', { name: 'updated_by', nullable: true, length: 50 })
    updated_by?: string;
  
    @UpdateDateColumn({ name: 'updated_at', select: false })
    updated_at?: string;
  
    @DeleteDateColumn({ name: 'deleted_at', select: false })
    deleted_at?: string;

    @CreateDateColumn({type: 'timestamp', name: 'timestamp', nullable: true})
    timestamp?: string;
  
}
  