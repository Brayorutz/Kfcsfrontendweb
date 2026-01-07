import { 
  users, 
  members,
  memberStatements,
  loans,
  products,
  orders,
  news,
  admins,
  contactMessages,
  type User, 
  type InsertUser,
  type Member,
  type InsertMember,
  type Statement,
  type InsertStatement,
  type Loan,
  type InsertLoan,
  type Product,
  type InsertProduct,
  type Order,
  type InsertOrder,
  type News,
  type InsertNews,
  type Admin,
  type InsertAdmin,
  type ContactMessage,
  type InsertContactMessage,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Member methods
  getMember(id: number): Promise<Member | undefined>;
  getMemberByNationalId(nationalId: string): Promise<Member | undefined>;
  getMemberByMemberNumber(memberNumber: string): Promise<Member | undefined>;
  getAllMembers(): Promise<Member[]>;
  getPendingMembers(): Promise<Member[]>;
  createMember(member: InsertMember): Promise<Member>;
  updateMemberStatus(id: number, status: string): Promise<void>;
  assignMemberNumber(id: number, memberNumber: string): Promise<void>;
  
  // Member statement methods
  getStatementsByMemberId(memberId: number): Promise<Statement[]>;
  createStatement(statement: InsertStatement): Promise<Statement>;
  
  // Loan methods
  getLoansByMemberId(memberId: number): Promise<Loan[]>;
  createLoan(loan: InsertLoan): Promise<Loan>;
  updateLoanStatus(id: number, status: string): Promise<void>;
  
  // Product methods
  getAllProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<void>;
  
  // Order methods
  getAllOrders(): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  
  // News methods
  getAllNews(): Promise<News[]>;
  getNews(id: number): Promise<News | undefined>;
  createNews(newsItem: InsertNews): Promise<News>;
  updateNews(id: number, newsItem: Partial<InsertNews>): Promise<void>;
  deleteNews(id: number): Promise<void>;
  
  // Contact Message methods
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  
  // Admin methods
  getAdminByUsername(username: string): Promise<Admin | undefined>;
  createAdmin(admin: InsertAdmin): Promise<Admin>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }
  
  // Member methods
  async getMember(id: number): Promise<Member | undefined> {
    const [member] = await db.select().from(members).where(eq(members.id, id));
    return member || undefined;
  }
  
  async getMemberByNationalId(nationalId: string): Promise<Member | undefined> {
    const [member] = await db.select().from(members).where(eq(members.nationalId, nationalId));
    return member || undefined;
  }
  
  async getMemberByMemberNumber(memberNumber: string): Promise<Member | undefined> {
    const [member] = await db.select().from(members).where(eq(members.memberNumber, memberNumber));
    return member || undefined;
  }
  
  async getAllMembers(): Promise<Member[]> {
    return db.select().from(members).orderBy(desc(members.createdAt));
  }
  
  async getPendingMembers(): Promise<Member[]> {
    return db.select().from(members).where(eq(members.status, "pending")).orderBy(desc(members.createdAt));
  }
  
  async createMember(insertMember: InsertMember): Promise<Member> {
    const memberCount = await db.select().from(members);
    const memberNumber = `KFCS-${String(memberCount.length + 1).padStart(4, '0')}`;
    
    const [member] = await db
      .insert(members)
      .values({ ...insertMember, memberNumber })
      .returning();
    return member;
  }
  
  async updateMemberStatus(id: number, status: string): Promise<void> {
    await db.update(members).set({ status }).where(eq(members.id, id));
  }
  
  async assignMemberNumber(id: number, memberNumber: string): Promise<void> {
    await db.update(members).set({ memberNumber }).where(eq(members.id, id));
  }
  
  // Statement methods
  async getStatementsByMemberId(memberId: number): Promise<Statement[]> {
    return db.select().from(memberStatements).where(eq(memberStatements.memberId, memberId)).orderBy(desc(memberStatements.date));
  }
  
  async createStatement(insertStatement: InsertStatement): Promise<Statement> {
    const [statement] = await db
      .insert(memberStatements)
      .values(insertStatement)
      .returning();
    return statement;
  }
  
  // Loan methods
  async getLoansByMemberId(memberId: number): Promise<Loan[]> {
    return db.select().from(loans).where(eq(loans.memberId, memberId)).orderBy(desc(loans.requestedAt));
  }
  
  async createLoan(insertLoan: InsertLoan): Promise<Loan> {
    const [loan] = await db
      .insert(loans)
      .values(insertLoan)
      .returning();
    return loan;
  }
  
  async updateLoanStatus(id: number, status: string): Promise<void> {
    await db.update(loans).set({ status }).where(eq(loans.id, id));
  }
  
  // Product methods
  async getAllProducts(): Promise<Product[]> {
    return db.select().from(products);
  }
  
  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product || undefined;
  }
  
  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const [product] = await db
      .insert(products)
      .values(insertProduct)
      .returning();
    return product;
  }
  
  async updateProduct(id: number, productData: Partial<InsertProduct>): Promise<void> {
    await db.update(products).set(productData).where(eq(products.id, id));
  }
  
  // Order methods
  async getAllOrders(): Promise<Order[]> {
    return db.select().from(orders).orderBy(desc(orders.createdAt));
  }
  
  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const [order] = await db
      .insert(orders)
      .values(insertOrder)
      .returning();
    return order;
  }
  
  // News methods
  async getAllNews(): Promise<News[]> {
    return db.select().from(news).orderBy(desc(news.publishedAt));
  }
  
  async getNews(id: number): Promise<News | undefined> {
    const [newsItem] = await db.select().from(news).where(eq(news.id, id));
    return newsItem || undefined;
  }
  
  async createNews(insertNews: InsertNews): Promise<News> {
    const [newsItem] = await db
      .insert(news)
      .values(insertNews)
      .returning();
    return newsItem;
  }
  
  async updateNews(id: number, newsData: Partial<InsertNews>): Promise<void> {
    await db.update(news).set(newsData).where(eq(news.id, id));
  }
  
  async deleteNews(id: number): Promise<void> {
    await db.delete(news).where(eq(news.id, id));
  }

  // Contact Message methods
  async createContactMessage(insertMessage: InsertContactMessage): Promise<ContactMessage> {
    const [message] = await db
      .insert(contactMessages)
      .values(insertMessage)
      .returning();
    return message;
  }
  
  // Admin methods
  async getAdminByUsername(username: string): Promise<Admin | undefined> {
    const [admin] = await db.select().from(admins).where(eq(admins.username, username));
    return admin || undefined;
  }
  
  async createAdmin(insertAdmin: InsertAdmin): Promise<Admin> {
    const [admin] = await db
      .insert(admins)
      .values(insertAdmin)
      .returning();
    return admin;
  }
}

export const storage = new DatabaseStorage();
