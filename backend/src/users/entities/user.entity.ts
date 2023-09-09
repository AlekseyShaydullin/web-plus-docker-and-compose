import { Column, Entity, OneToMany } from 'typeorm';
import { Length, IsUrl, IsEmail } from 'class-validator';
import { Wish } from '../../wishes/entities/wish.entity';
import { BaseEntity } from '../../base-entity/base.entity';
import { Wishlist } from '../../wishlists/entities/wishlist.entity';
import { Offer } from '../../offers/entities/offer.entity';

@Entity()
export class User extends BaseEntity {
  @Column({
    type: 'varchar',
    unique: true,
    nullable: false,
  })
  @Length(2, 30)
  username: string;

  @Column({
    type: 'varchar',
    default: 'Пока ничего не рассказал о себе',
  })
  @Length(2, 200)
  about: string;

  @Column({
    type: 'varchar',
    default: 'https://i.pravatar.cc/300',
  })
  @IsUrl()
  avatar: string;

  @Column({
    type: 'varchar',
    unique: true,
    nullable: false,
  })
  @IsEmail()
  email: string;

  @Column({
    type: 'varchar',
  })
  password: string;

  @OneToMany(() => Wish, (wish) => wish.owner)
  wishes: Wish[];

  @OneToMany(() => Offer, (offer) => offer.owner)
  offers: Offer[];

  @OneToMany(() => Wishlist, (wishlist) => wishlist.owner)
  wishlists: Wishlist[];
}
