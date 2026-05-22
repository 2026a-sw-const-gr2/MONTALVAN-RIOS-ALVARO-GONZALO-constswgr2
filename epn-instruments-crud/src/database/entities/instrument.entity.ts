import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('instruments')
export class InstrumentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  nombre: string;

  @Column({ nullable: false })
  tipo: string;

  @Column({ nullable: true })
  marca: string;

  @Column({ nullable: true })
  modelo: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  precio: number;

  @Column({ default: 0 })
  cantidad: number;

  @Column({ nullable: true })
  descripcion: string;

  @Column({ nullable: true })
  condicion: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  fecha_ingreso: Date;

  @Column({ nullable: true })
  ubicacion: string;
}
