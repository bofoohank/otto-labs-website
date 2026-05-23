"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Crown, ShieldCheck, User, UserCog } from "lucide-react";

import { AdminHeaderSearch } from "./AdminHeaderSearch";
import { AdminPanelLayout } from "./AdminPanelLayout";
import { AppFilter } from "@/components/ui/AppFilter";

import type { AdminUser, MemberTab } from "@/types/admin";
import type { Role } from "@/types/user";

type Props = {
  users: AdminUser[];
  memberTab: MemberTab;
  onChangeMemberTab: (tab: MemberTab) => void;
  onUpdateRole: (userId: string, role: Role) => void;
};

const memberTabItems = [
  {
    label: "Thông tin",
    value: "info",
  },
  {
    label: "Role",
    value: "roles",
  },
] satisfies {
  label: string;
  value: MemberTab;
}[];

export function MembersTab({
  users,
  memberTab,
  onChangeMemberTab,
  onUpdateRole,
}: Props) {
  const [searchValue, setSearchValue] = useState("");

  const filteredUsers = useMemo(() => {
    const keyword = searchValue.trim().toLowerCase();

    if (!keyword) return users;

    return users.filter((user) =>
      user.name.toLowerCase().includes(keyword),
    );
  }, [users, searchValue]);

  function roleIcon(role: Role) {
    if (role === "Admin") {
      return <Crown className="text-orange-500" size={18} />;
    }

    if (role === "Mod") {
      return <ShieldCheck className="text-blue-400" size={18} />;
    }

    return <User className="text-neutral-400" size={18} />;
  }

  function roleBadge(role: Role) {
    if (role === "Admin") {
      return "bg-orange-500/20 text-orange-400 border-orange-500/30";
    }

    if (role === "Mod") {
      return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    }

    return "bg-white/5 text-neutral-300 border-white/10";
  }

  return (
    <AdminPanelLayout
        icon={<UserCog size={24} />}
        title="Member"
        actions={
          <div className="grid w-full grid-cols-[1fr_150px] items-center gap-2">
            <AdminHeaderSearch
              value={searchValue}
              placeholder="Tìm tên member..."
              onChange={setSearchValue}
            />
            <AppFilter<MemberTab>
              value={memberTab}
              items={memberTabItems}
              onChange={onChangeMemberTab}
              size="md"
            />
          </div>
        }
      >
      <div className="min-h-0">
        {memberTab === "info" && (
          <div className="grid gap-3 md:grid-cols-2 2xl:grid-cols-4">
            {filteredUsers.map((user) => (
              <div
                key={user._id}
                className="rounded-2xl border border-white/10 bg-black p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="relative grid h-12 w-12 place-items-center overflow-hidden rounded-2xl bg-orange-500 text-lg font-black">
                    {user.avatar ? (
                      <Image
                        src={user.avatar}
                        alt={user.name}
                        fill
                        sizes="48px"
                        unoptimized
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      user.name.charAt(0)
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      {roleIcon(user.role)}
                      <h3 className="truncate font-black">{user.name}</h3>
                    </div>

                    <p className="truncate text-sm text-neutral-400">
                      @{user.username}
                    </p>
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-sm text-neutral-400">
                  <p className="truncate">
                    <span className="font-bold text-neutral-300">Gmail:</span>{" "}
                    {user.email}
                  </p>

                  <p>
                    <span className="font-bold text-neutral-300">SĐT:</span>{" "}
                    {user.phone || "Chưa có"}
                  </p>

                  <p>
                    <span className="font-bold text-neutral-300">Role:</span>{" "}
                    {user.role}
                  </p>
                </div>
              </div>
            ))}

            {filteredUsers.length === 0 && (
              <div className="col-span-full rounded-3xl border border-white/10 bg-black p-8 text-center text-sm font-bold text-neutral-500">
                Không tìm thấy người dùng phù hợp.
              </div>
            )}
          </div>
        )}

        {memberTab === "roles" && (
          <div className="space-y-3">
            {filteredUsers.map((user) => (
              <div
                key={user._id}
                className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-black p-4 md:flex-row md:items-center md:justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="relative grid h-12 w-12 place-items-center overflow-hidden rounded-2xl bg-orange-500 text-lg font-black">
                    {user.avatar ? (
                      <Image
                        src={user.avatar}
                        alt={user.name}
                        fill
                        sizes="48px"
                        unoptimized
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      user.name.charAt(0)
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      {roleIcon(user.role)}
                      <h3 className="font-black">{user.name}</h3>
                    </div>

                    <p className="text-sm text-neutral-400">
                      @{user.username}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {(["Member", "Mod", "Admin"] as Role[]).map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => onUpdateRole(user._id, role)}
                      className={`flex h-11 items-center justify-center rounded-xl border px-5 text-sm font-black transition ${
                        user.role === role
                          ? roleBadge(role)
                          : "border-white/10 bg-white/5 text-neutral-400 hover:border-orange-500 hover:text-orange-500"
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {filteredUsers.length === 0 && (
              <div className="rounded-3xl border border-white/10 bg-black p-8 text-center text-sm font-bold text-neutral-500">
                Không tìm thấy người dùng phù hợp.
              </div>
            )}
          </div>
        )}
      </div>
    </AdminPanelLayout>
  );
}
