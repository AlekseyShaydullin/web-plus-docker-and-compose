import { Column, Entity, ManyToOne } from 'typeorm';
import { IsBoolean, IsNumber } from 'class-validator';
import { BaseEntity } from 'src/base-entity/base.entity';
import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';

@Entity()
export class Offer extends BaseEntity {
  @ManyToOne(() => User, (user) => user.offers)
  owner: User;

  @ManyToOne(() => Wish, (wish) => wish.offers)
  item: Wish;

  @Column({
    type: 'float',
  })
  @IsNumber({
    maxDecimalPlaces: 2,
  })
  amount: number;

  @Column({
    type: 'boolean',
    default: false,
  })
  @IsBoolean()
  hidden: boolean;
}
