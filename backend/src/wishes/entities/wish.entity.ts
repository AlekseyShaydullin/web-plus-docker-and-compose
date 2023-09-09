import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { IsDecimal, IsNumber, IsUrl, Length } from 'class-validator';
import { User } from '../../users/entities/user.entity';
import { BaseEntity } from '../../base-entity/base.entity';
import { Offer } from '../../offers/entities/offer.entity';
import { Wishlist } from '../../wishlists/entities/wishlist.entity';

@Entity()
export class Wish extends BaseEntity {
  @Column({
    type: 'varchar',
  })
  @Length(1, 250)
  name: string;

  @Column({
    type: 'varchar',
  })
  @IsUrl()
  link: string;

  @Column({
    type: 'varchar',
  })
  @IsUrl()
  image: string;

  @Column({
    default: 0,
    type: 'decimal',
    scale: 2,
  })
  @IsNumber()
  price: number;

  @Column({
    default: 0,
    type: 'decimal',
    scale: 2,
  })
  @IsNumber()
  raised: number;

  @ManyToOne(() => User, (user) => user.wishes)
  owner: User;

  @Column({
    type: 'varchar',
  })
  @Length(1, 1024)
  description: string;

  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];

  @Column({
    type: 'int',
    default: 0,
  })
  @IsDecimal()
  copied: number;

  @ManyToOne(() => Wishlist, (wishList) => wishList.items)
  wishList: Wishlist;
}
