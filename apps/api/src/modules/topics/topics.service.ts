import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { CreateTopicDto } from '@app/shared';

export interface TopicNode {
  id: string;
  code: string;
  name: string;
  category: string;
  parentId: string | null;
  sortOrder: number;
  isActive: boolean;
  children: TopicNode[];
}

@Injectable()
export class TopicsService {
  constructor(private readonly prisma: PrismaService) {}

  listFlat() {
    return this.prisma.topic.findMany({
      where: { isActive: true },
      orderBy: [{ category: 'asc' }, { sortOrder: 'asc' }],
    });
  }

  async tree(): Promise<TopicNode[]> {
    const rows = await this.prisma.topic.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: 'asc' }],
    });
    const byId = new Map<string, TopicNode>();
    for (const r of rows) {
      byId.set(r.id, {
        id: r.id,
        code: r.code,
        name: r.name,
        category: r.category,
        parentId: r.parentId,
        sortOrder: r.sortOrder,
        isActive: r.isActive,
        children: [],
      });
    }
    const roots: TopicNode[] = [];
    for (const node of byId.values()) {
      if (node.parentId) {
        const parent = byId.get(node.parentId);
        if (parent) parent.children.push(node);
        else roots.push(node);
      } else {
        roots.push(node);
      }
    }
    return roots;
  }

  create(dto: CreateTopicDto) {
    return this.prisma.topic.create({
      data: {
        code: dto.code,
        name: dto.name,
        category: dto.category as never,
        parentId: dto.parentId,
        level: dto.level,
        sortOrder: dto.sortOrder ?? 0,
      },
    });
  }

  async update(id: string, dto: Partial<CreateTopicDto>) {
    const existing = await this.prisma.topic.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Topic not found');
    return this.prisma.topic.update({
      where: { id },
      data: {
        name: dto.name,
        parentId: dto.parentId,
        level: dto.level,
        sortOrder: dto.sortOrder,
      },
    });
  }

  softDelete(id: string) {
    return this.prisma.topic.update({ where: { id }, data: { isActive: false } });
  }
}
