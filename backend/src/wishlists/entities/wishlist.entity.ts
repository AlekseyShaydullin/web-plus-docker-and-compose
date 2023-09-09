import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { IsUrl, Length } from 'class-validator';
import { BaseEntity } from 'src/base-entity/base.entity';
import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';

@Entity()
export class Wishlist extends BaseEntity {
  @Column({
    type: 'varchar',
  })
  @Length(1, 250)
  name: string;

  @Column({
    type: 'varchar',
    default: '',
  })
  @Length(1500)
  description: string;

  @Column({
    type: 'varchar',
  })
  @IsUrl()
  image: string;

  @ManyToOne(() => User, (user) => user.wishlists)
  owner: User;

  @OneToMany(() => Wish, (wish) => wish.wishList)
  items: Wish[];
}
